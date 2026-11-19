import { createHash } from "node:crypto";

import { z } from "zod";

import type { CandidateStagingFile } from "../../src/lib/schema/candidate";

export const MIT_OCW_SOURCE_ID = "mit-learn-ocw";
export const MIT_OCW_LIST_URL =
  "https://api.learn.mit.edu/api/v1/learning_resources/";

export const MIT_OCW_POLICY = {
  actor: "skillmvp:source-ready-policy",
  policyId: "source-ready-listing",
  policyVersion: "1.1.0",
  sourceId: MIT_OCW_SOURCE_ID,
  allowedSourceHosts: ["ocw.mit.edu"]
} as const;

const NamedCodeSchema = z.object({
  code: z.string().optional(),
  name: z.string().optional()
});
const TopicSchema = z.object({
  id: z.number().int().optional(),
  name: z.string().optional(),
  parent: z.number().int().nullable().optional()
});
const RunSchema = z.object({
  level: z.array(NamedCodeSchema).optional(),
  published: z.boolean(),
  url: z.string().optional()
});
const MitOcxResourceSchema = z
  .object({
    id: z.number().int().positive(),
    title: z.string().min(1),
    url: z.string().url(),
    description: z.string().nullable().optional(),
    last_modified: z.string().nullable().optional(),
    published: z.boolean(),
    free: z.boolean(),
    license_cc: z.boolean(),
    resource_type: z.string().optional(),
    topics: z.array(TopicSchema),
    ocw_topics: z.array(z.string()).optional(),
    platform: NamedCodeSchema,
    offered_by: NamedCodeSchema.optional(),
    runs: z.array(RunSchema).min(1)
  })
  .passthrough();

export type MitOcxResource = z.infer<typeof MitOcxResourceSchema>;

const MitOcxListEnvelopeSchema = z.object({
  count: z.number().int().nonnegative(),
  next: z.string().nullable(),
  previous: z.string().nullable(),
  results: z.array(z.unknown())
});

export type MitOcxListResponse = z.infer<typeof MitOcxListEnvelopeSchema>;

export type DiscoveryResult = {
  response: MitOcxListResponse;
  attempts: number;
  requestUrl: string;
  mode: "live" | "snapshot";
};

type FetchLike = typeof fetch;

class NonRetryableDiscoveryError extends Error {}

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const parseMitOcxListResponse = (input: unknown, limit: number) => {
  const parsed = MitOcxListEnvelopeSchema.parse(input);
  if (parsed.results.length > limit) {
    throw new Error("MIT Learn response exceeds the configured record bound.");
  }
  return parsed;
};

export const fetchMitOcxCourses = async ({
  limit,
  maxAttempts = 3,
  timeoutMs = 10_000,
  fetchImpl = fetch
}: {
  limit: number;
  maxAttempts?: number;
  timeoutMs?: number;
  fetchImpl?: FetchLike;
}): Promise<DiscoveryResult> => {
  if (!Number.isInteger(limit) || limit < 20 || limit > 50) {
    throw new Error("MIT OCW pilot limit must be an integer from 20 through 50.");
  }
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1 || maxAttempts > 3) {
    throw new Error("MIT OCW discovery allows one through three attempts.");
  }

  const requestUrl = new URL(MIT_OCW_LIST_URL);
  requestUrl.searchParams.set("platform", "ocw");
  requestUrl.searchParams.set("resource_type", "course");
  requestUrl.searchParams.set("limit", String(limit));
  requestUrl.searchParams.set("offset", "0");

  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetchImpl(requestUrl, {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "SkillMVP/1.0 (+https://github.com/diegosalazaru/SkillMVP)"
        },
        signal: controller.signal
      });
      if (!response.ok) {
        const retryable = response.status === 429 || response.status >= 500;
        if (!retryable || attempt === maxAttempts) {
          const ErrorType = retryable ? Error : NonRetryableDiscoveryError;
          throw new ErrorType(
            `MIT Learn API returned HTTP ${response.status} after ${attempt} attempt(s).`
          );
        }
        lastError = new Error(`Retryable HTTP ${response.status}.`);
      } else {
        const responseBody = (await response.json()) as unknown;
        let body: MitOcxListResponse;
        try {
          body = parseMitOcxListResponse(responseBody, limit);
        } catch (error) {
          throw new NonRetryableDiscoveryError(
            `MIT Learn API returned an invalid bounded catalog envelope: ${
              error instanceof Error ? error.message : String(error)
            }`
          );
        }
        return {
          response: body,
          attempts: attempt,
          requestUrl: requestUrl.toString(),
          mode: "live"
        };
      }
    } catch (error) {
      if (error instanceof NonRetryableDiscoveryError) throw error;
      lastError = error;
      if (attempt === maxAttempts) break;
    } finally {
      clearTimeout(timeout);
    }
    await wait(250 * 2 ** (attempt - 1));
  }
  throw lastError instanceof Error
    ? lastError
    : new Error("MIT Learn API discovery failed within retry limits.");
};

const recordDigest = (value: unknown) =>
  createHash("sha256")
    .update(JSON.stringify(value) ?? "undefined")
    .digest("hex");

const asRecord = (value: unknown): Record<string, unknown> =>
  value != null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const sourceCategory = (resource: MitOcxResource | null) => {
  if (!resource) return "society-other";
  const terms = [
    resource.title,
    ...(resource.ocw_topics ?? []),
    ...resource.topics.map((topic) => topic.name ?? "")
  ].join(" ");
  if (
    /\b(language|linguistic|chinese|spanish|french|german|japanese|russian|arabic|italian|portuguese)\b/i.test(
      terms
    )
  ) {
    return "languages";
  }
  if (/Art, Design & Architecture/i.test(terms)) return "design-creativity";
  if (
    /Business & Management|Innovation & Entrepreneurship|Education & Teaching/i.test(
      terms
    )
  ) {
    return "business-professional";
  }
  if (/Data Science, Analytics & Computer Technology/i.test(terms)) {
    return "technology-data";
  }
  if (/Engineering|Science & Math|Energy, Climate & Sustainability/i.test(terms)) {
    return "science-engineering";
  }
  if (/Humanities/i.test(terms)) return "humanities";
  return "society-other";
};

const asDateTimeOrNull = (value: string | null | undefined) => {
  if (!value || Number.isNaN(Date.parse(value))) return null;
  return new Date(value).toISOString();
};

export const buildMitOcxCandidateInput = (
  resources: unknown[],
  {
    asOf,
    receivedAt,
    batchId
  }: { asOf: string; receivedAt: string; batchId: string }
) => ({
  batchId,
  receivedAt,
  candidates: resources.map((rawResource, index) => {
    const raw = asRecord(rawResource);
    const parsed = MitOcxResourceSchema.safeParse(rawResource);
    const resource = parsed.success ? parsed.data : null;
    const rawId = raw.id;
    const providerCourseId =
      typeof rawId === "number" && Number.isInteger(rawId) && rawId > 0
        ? String(rawId)
        : null;
    const digest = recordDigest(rawResource);
    const quarantineKey = `invalid-${index}-${digest.slice(0, 12)}`;
    const identityKey = providerCourseId ?? quarantineKey;
    const proposedCourseId = providerCourseId
      ? `mit-ocw-${providerCourseId}`
      : `mit-ocw-quarantine-${quarantineKey}`;
    const sourceUrl = typeof raw.url === "string" ? raw.url : "";
    const title = typeof raw.title === "string" ? raw.title : "";
    const category = sourceCategory(resource);
    const hasPublishedRun = resource?.runs.some((run) => run.published) === true;
    const availabilityStatus =
      resource?.published === true && hasPublishedRun
        ? ("current" as const)
        : resource?.published === false ||
            (resource != null && resource.runs.every((run) => !run.published))
          ? ("unavailable" as const)
          : ("unknown" as const);
    const freeLicensedCourse =
      resource?.free === true && resource.license_cc === true;
    const evidenceUrl = sourceUrl || MIT_OCW_LIST_URL;
    const pricing =
      freeLicensedCourse && providerCourseId && sourceUrl
        ? [
            {
              id: `${proposedCourseId}-free-access`,
              model: "free" as const,
              amount: 0,
              currency: "USD",
              normalizedUsdAmount: 0,
              qualifier: "exact" as const,
              cadence: "other" as const,
              scope: "Self-guided MIT OpenCourseWare materials",
              normalizationBasis: "provider_published_usd" as const,
              actionUrl: sourceUrl,
              evidenceUrls: [sourceUrl],
              observedAt: asOf,
              referenceMarket: null,
              accessContext: "public_provider_page" as const,
              conditions:
                "Free self-guided OCW materials; no enrollment, academic credit, or certificate."
            }
          ]
        : [];
    const normalizationIssues = parsed.success
      ? []
      : parsed.error.issues.map((issue) => ({
          path: issue.path.join("."),
          code: issue.code,
          message: issue.message
        }));

    return {
      candidateId: `${MIT_OCW_SOURCE_ID}:${identityKey}`,
      proposedCourseId,
      sourceIdentity: {
        sourceId: MIT_OCW_SOURCE_ID,
        providerCourseId
      },
      platform: "MIT OpenCourseWare",
      provider: "Massachusetts Institute of Technology",
      canonicalSourceUrl: sourceUrl,
      discoveredAt: asOf,
      observedAt: asOf,
      course: {
        id: proposedCourseId,
        platform: "MIT OpenCourseWare",
        title,
        url: sourceUrl,
        skillSlug: category,
        level: "unknown" as const,
        durationHours: null,
        language: "unknown",
        priceModel: "free" as const,
        priceAmount: freeLicensedCourse ? 0 : null,
        currency: freeLicensedCourse ? "USD" : null,
        priceInterval: null,
        rating: null,
        reviewCount: null,
        certificate: false,
        lastUpdatedAt: asDateTimeOrNull(resource?.last_modified),
        shortDescription: null,
        syllabusBullets: [],
        prerequisitesBullets: [],
        source: "other" as const
      },
      fieldEvidence: [
        "title",
        "platform",
        "sourceUrl",
        "availability",
        "pricingOptions"
      ].map((field) => ({ field, sourceUrl: evidenceUrl, observedAt: asOf })),
      pricingEvidence: pricing,
      availability: {
        status: availabilityStatus,
        evidenceUrls: [evidenceUrl],
        observedAt: asOf
      },
      sourceMetadata: {
        courseId: proposedCourseId,
        sourceUrl,
        sourceType: "official_provider_api",
        verificationStatus: parsed.success
          ? "partially_verified"
          : "pending",
        publicationStatus: "published",
        lastVerifiedAt: asOf,
        verifiedFields: {
          title: parsed.success,
          platform: resource?.platform.code === "ocw",
          sourceUrl: sourceUrl.startsWith("https://ocw.mit.edu/"),
          availability: availabilityStatus === "current",
          price: freeLicensedCourse,
          pricingOptions: freeLicensedCourse,
          certificate: parsed.success,
          language: false,
          level: false,
          duration: false
        },
        sourceCategory: category,
        sourceLastModified: resource?.last_modified ?? null,
        sourceRecordDigest: digest,
        rawProviderCourseId:
          typeof rawId === "string" || typeof rawId === "number"
            ? rawId
            : null,
        normalizationIssues,
        licenseClaimFromRecord: resource?.license_cc === true,
        notes:
          "MIT Learn/OCW listing metadata normalized for isolated evaluation. Source-use permission remains externally unresolved; no content or image reuse is asserted."
      },
      ...(parsed.success
        ? {}
        : {
            humanNote:
              "Upstream record failed per-record normalization and is retained only for automatic quarantine."
          })
    };
  })
});

export const categoryCounts = (batch: CandidateStagingFile) => {
  const counts: Record<string, number> = {};
  for (const candidate of batch.candidates) {
    const category = String(candidate.sourceMetadata.sourceCategory ?? "unknown");
    counts[category] = (counts[category] ?? 0) + 1;
  }
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))
  );
};
