import { createHash, randomUUID } from "node:crypto";
import {
  closeSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  openSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync
} from "node:fs";
import { dirname, relative, resolve } from "node:path";

import { AcceptedSourceMetadataSchema } from "../src/lib/schema/candidate";
import { currentDate, getArgument } from "./lib/cli-args";
import {
  applyMachinePublicationPolicy,
  assertDistinctWriteTargets,
  buildBatchReport,
  canonicalPathForWrite,
  createWriteBoundary,
  ingestCandidateInput,
  promoteCandidates,
  withdrawAcceptedBySourceIdentity,
  writeJsonAtomic
} from "./lib/candidate-pipeline";
import {
  AuthorizedSourceState,
  isSourceWideAnomaly,
  reconcileWithdrawalState
} from "./lib/authorized-cycle";
import {
  buildMitOcxCandidateInput,
  categoryCounts,
  fetchMitOcxCourses,
  MIT_OCW_POLICY,
  MIT_OCW_SOURCE_ID,
  parseMitOcxListResponse
} from "./lib/mit-learn-ocw";

const productionCatalog = resolve("data/normalized/courses.json");
const productionMetadata = resolve(
  "data/normalized/course-source-metadata.json"
);
const productionManifest = resolve("data/decision-grade-manifest.json");
const stagingRoot = resolve("data/staging");
const protectedProductionPaths = [
  productionCatalog,
  productionMetadata,
  productionManifest
];
const MAX_RETAINED_RUNS = 25;

const digestFile = (path: string) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, "utf8")) as T;

const productionDigests = () => ({
  catalog: digestFile(productionCatalog),
  metadata: digestFile(productionMetadata),
  manifest: digestFile(productionManifest)
});

const assertProductionUnchanged = (
  before: ReturnType<typeof productionDigests>
) => {
  const after = productionDigests();
  if (JSON.stringify(before) !== JSON.stringify(after)) {
    throw new Error("Production invariant failed: protected data changed.");
  }
  return after;
};

const acquireLock = (
  path: string,
  boundary: ReturnType<typeof createWriteBoundary>
) => {
  boundary.assertWritable(path);
  mkdirSync(dirname(path), { recursive: true });
  if (existsSync(path)) {
    const ageMs = Date.now() - statSync(path).mtimeMs;
    if (ageMs > 30 * 60 * 1000) rmSync(path);
  }
  try {
    return openSync(path, "wx");
  } catch {
    throw new Error(`Another isolated ingestion run holds the lock: ${path}`);
  }
};

const pruneRunHistory = (
  runsDirectory: string,
  boundary: ReturnType<typeof createWriteBoundary>
) => {
  if (!existsSync(runsDirectory)) return;
  const runDirectories = readdirSync(runsDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => resolve(runsDirectory, entry.name))
    .sort();
  for (const runDirectory of runDirectories.slice(0, -MAX_RETAINED_RUNS)) {
    boundary.assertWritable(runDirectory);
    rmSync(runDirectory, { recursive: true });
  }
};

const preserveDiscoveryDates = (
  input: ReturnType<typeof buildMitOcxCandidateInput>,
  metadataPath: string
) => {
  const metadata = AcceptedSourceMetadataSchema.array().parse(
    readJson<unknown>(metadataPath)
  );
  const firstSeenByIdentity = new Map(
    metadata.flatMap((item) => {
      const identity = item.ingestion?.sourceIdentity;
      return identity
        ? [
            [
              `${identity.sourceId}\u0000${identity.providerCourseId}`,
              item.ingestion!.discoveredAt
            ] as const
          ]
        : [];
    })
  );
  return {
    ...input,
    candidates: input.candidates.map((candidate) => {
      const providerCourseId = candidate.sourceIdentity.providerCourseId;
      const original = providerCourseId
        ? firstSeenByIdentity.get(
            `${candidate.sourceIdentity.sourceId}\u0000${providerCourseId}`
          )
        : undefined;
      return original ? { ...candidate, discoveredAt: original } : candidate;
    })
  };
};

const run = async () => {
  const asOf = getArgument("--as-of", { fallback: currentDate() })!;
  const limit = Number(getArgument("--limit", { fallback: "50" }));
  const workspace = resolve(
    getArgument("--workspace", {
      fallback: "data/staging/issue-135-mit-ocw"
    })!
  );
  const snapshotArgument = getArgument("--input-snapshot");
  const snapshotPath = snapshotArgument ? resolve(snapshotArgument) : undefined;
  const liveRequested = process.argv.includes("--live");
  const evidenceOutputArgument = getArgument("--evidence-output");
  const evidenceOutput = evidenceOutputArgument
    ? resolve(evidenceOutputArgument)
    : undefined;

  if (!Number.isInteger(limit) || limit < 20 || limit > 50) {
    throw new Error("--limit must be an integer from 20 through 50.");
  }
  if ((snapshotPath ? 1 : 0) + (liveRequested ? 1 : 0) !== 1) {
    throw new Error(
      "Choose exactly one source mode: --input-snapshot for offline evaluation or --live after permission is documented."
    );
  }
  if (
    liveRequested &&
    process.env.SKILLMVP_MIT_LEARN_LIVE_ACCESS_AUTHORIZED !== "1"
  ) {
    throw new Error(
      "Live MIT Learn access is disabled: source-use permission is not documented."
    );
  }
  if (snapshotPath && !existsSync(snapshotPath)) {
    throw new Error(`Offline snapshot does not exist: ${snapshotPath}`);
  }

  const stagingBoundary = createWriteBoundary({
    allowedRoot: stagingRoot,
    protectedPaths: protectedProductionPaths
  });
  stagingBoundary.assertWritable(workspace);
  if (
    canonicalPathForWrite(workspace) === canonicalPathForWrite(stagingRoot)
  ) {
    throw new Error("The isolated workspace must be a child of data/staging.");
  }
  const boundary = createWriteBoundary({
    allowedRoot: workspace,
    protectedPaths: protectedProductionPaths
  });

  const executedAt = new Date().toISOString();
  const runId = `${executedAt.replace(/[:.]/g, "-")}-${randomUUID()}`;
  const runDirectory = resolve(workspace, "runs", runId);
  const stagingPath = resolve(runDirectory, "candidates.json");
  const receiptPath = resolve(runDirectory, "promotion-receipt.json");
  const auditPath = resolve(runDirectory, "audit.json");
  const reportPath = resolve(runDirectory, "report.json");
  const acceptedDirectory = resolve(workspace, "accepted");
  const catalogPath = resolve(acceptedDirectory, "courses.json");
  const metadataPath = resolve(
    acceptedDirectory,
    "course-source-metadata.json"
  );
  const statePath = resolve(workspace, "source-state.json");
  const latestPath = resolve(workspace, "latest.json");
  const lockPath = resolve(workspace, ".run.lock");
  const allDestinations = [
    stagingPath,
    receiptPath,
    auditPath,
    reportPath,
    catalogPath,
    metadataPath,
    statePath,
    latestPath,
    lockPath,
    ...(evidenceOutput ? [evidenceOutput] : [])
  ];
  for (const destination of allDestinations) boundary.assertWritable(destination);
  assertDistinctWriteTargets([
    ...allDestinations,
    ...(snapshotPath ? [snapshotPath] : [])
  ]);
  if (evidenceOutput) {
    createWriteBoundary({
      allowedRoot: resolve(workspace, "exports"),
      protectedPaths: protectedProductionPaths
    }).assertWritable(evidenceOutput);
  }

  const productionBefore = productionDigests();
  const discovery = snapshotPath
    ? {
        response: parseMitOcxListResponse(readJson<unknown>(snapshotPath), limit),
        attempts: 0,
        requestUrl: `snapshot:${relative(process.cwd(), snapshotPath)}`,
        mode: "snapshot" as const
      }
    : await fetchMitOcxCourses({ limit });

  const lock = acquireLock(lockPath, boundary);
  try {
    if (existsSync(runDirectory)) {
      throw new Error(`Immutable run directory already exists: ${runDirectory}`);
    }
    boundary.assertWritable(runDirectory);
    mkdirSync(runDirectory, { recursive: true });
    boundary.assertWritable(acceptedDirectory);
    mkdirSync(acceptedDirectory, { recursive: true });
    if (!existsSync(catalogPath)) {
      boundary.assertWritable(catalogPath);
      copyFileSync(productionCatalog, catalogPath);
    }
    if (!existsSync(metadataPath)) {
      boundary.assertWritable(metadataPath);
      copyFileSync(productionMetadata, metadataPath);
    }

    const previousState = existsSync(statePath)
      ? readJson<AuthorizedSourceState>(statePath)
      : undefined;
    const sourcePaused = isSourceWideAnomaly(
      previousState?.totalAvailable,
      discovery.response.count
    );
    if (sourcePaused) {
      const pausedReport = {
        runId,
        sourceId: MIT_OCW_SOURCE_ID,
        executedAt,
        asOf,
        sourceMode: discovery.mode,
        sourcePaused: true,
        reason: "source_wide_count_anomaly",
        previousTotal: previousState?.totalAvailable ?? null,
        observedTotal: discovery.response.count,
        published: 0,
        permissionStatus: "pending_external_confirmation",
        productionTargetsChanged: false
      };
      writeJsonAtomic(auditPath, { runId, decisions: [] }, boundary);
      writeJsonAtomic(receiptPath, { runId, promoted: 0 }, boundary);
      writeJsonAtomic(reportPath, pausedReport, boundary);
      writeJsonAtomic(
        latestPath,
        { runId, runDirectory: relative(workspace, runDirectory), sourcePaused: true },
        boundary
      );
      if (evidenceOutput) writeJsonAtomic(evidenceOutput, pausedReport, boundary);
      pruneRunHistory(resolve(workspace, "runs"), boundary);
      assertProductionUnchanged(productionBefore);
      return pausedReport;
    }

    const batchId = `${MIT_OCW_SOURCE_ID}-${runId}`;
    const rawInput = preserveDiscoveryDates(
      buildMitOcxCandidateInput(discovery.response.results, {
        asOf,
        receivedAt: executedAt,
        batchId
      }),
      metadataPath
    );
    const staged = ingestCandidateInput(rawInput);
    const decided = applyMachinePublicationPolicy(staged, {
      asOf,
      decidedAt: executedAt,
      policy: MIT_OCW_POLICY
    });
    writeJsonAtomic(stagingPath, decided, boundary);

    const publishIds = decided.candidates
      .filter((candidate) => candidate.machineDecision?.outcome === "publish")
      .map((candidate) => candidate.candidateId);
    const receipt =
      publishIds.length > 0
        ? promoteCandidates({
            stagingPath,
            candidateIds: publishIds,
            catalogPath,
            metadataPath,
            receiptPath,
            asOf,
            machinePolicy: MIT_OCW_POLICY,
            writeBoundary: boundary
          })
        : {
            batchId,
            candidateIds: [],
            promoted: 0,
            inserted: 0,
            updated: 0,
            refreshed: 0,
            unchanged: 0,
            acceptedSemanticChanges: 0
          };
    if (publishIds.length === 0) writeJsonAtomic(receiptPath, receipt, boundary);
    const batchReport = buildBatchReport(decided, { asOf }, receipt);
    const observedProviderIds = decided.candidates.flatMap((candidate) =>
      candidate.sourceIdentity.providerCourseId
        ? [candidate.sourceIdentity.providerCourseId]
        : []
    );
    const withdrawal = reconcileWithdrawalState({
      previous: previousState,
      sourceId: MIT_OCW_SOURCE_ID,
      totalAvailable: discovery.response.count,
      observedProviderIds,
      observedAt: asOf,
      providerHealthy: true,
      completeSnapshot: false
    });
    const withdrawalReceipt = withdrawAcceptedBySourceIdentity({
      catalogPath,
      metadataPath,
      sourceId: MIT_OCW_SOURCE_ID,
      providerCourseIds: withdrawal.withdrawn,
      withdrawnAt: asOf,
      writeBoundary: boundary
    });
    writeJsonAtomic(statePath, withdrawal.state, boundary);

    const audit = {
      runId,
      sourceId: MIT_OCW_SOURCE_ID,
      batchId,
      requestUrl: discovery.requestUrl,
      sourceMode: discovery.mode,
      receivedAt: executedAt,
      decidedAt: executedAt,
      actor: MIT_OCW_POLICY.actor,
      policyId: MIT_OCW_POLICY.policyId,
      policyVersion: MIT_OCW_POLICY.policyVersion,
      decisions: decided.candidates.map((candidate) => ({
        candidateId: candidate.candidateId,
        sourceIdentity: candidate.sourceIdentity,
        canonicalSourceUrl: candidate.canonicalSourceUrl,
        discoveredAt: candidate.discoveredAt,
        observedAt: candidate.observedAt,
        sourceRecordDigest:
          candidate.sourceMetadata.sourceRecordDigest ?? null,
        candidateDigest: candidate.machineDecision?.candidateDigest ?? null,
        outcome: candidate.machineDecision?.outcome ?? "quarantine",
        reasons:
          candidate.machineDecision?.reasons ?? candidate.exceptionCodes
      }))
    };
    writeJsonAtomic(auditPath, audit, boundary);

    const productionAfterOperationalWrites =
      assertProductionUnchanged(productionBefore);
    const report = {
      runId,
      sourceId: MIT_OCW_SOURCE_ID,
      sourceName: "MIT Learn / MIT OpenCourseWare",
      sourceMode: discovery.mode,
      sourceAccess:
        discovery.mode === "snapshot"
          ? "offline snapshot"
          : "live access explicitly enabled after external authorization",
      requestUrl: discovery.requestUrl,
      executedAt,
      asOf,
      sourcePaused: false,
      sourceTotalAvailable: discovery.response.count,
      discovered: discovery.response.results.length,
      normalized: batchReport.normalized,
      valid: batchReport.reviewReady,
      quarantined: batchReport.quarantined,
      isolatedPublished: receipt.promoted,
      isolatedInserted: receipt.inserted,
      isolatedUpdated: receipt.updated,
      isolatedRefreshed: receipt.refreshed,
      isolatedUnchanged: receipt.unchanged,
      confirmedWithdrawals: withdrawalReceipt.changed,
      withdrawalCapability: "incomplete_partial_page_only",
      categories: categoryCounts(decided),
      exceptionCounts: batchReport.exceptionCounts,
      policy: {
        actor: MIT_OCW_POLICY.actor,
        id: MIT_OCW_POLICY.policyId,
        version: MIT_OCW_POLICY.policyVersion
      },
      operatingLimits: {
        records: limit,
        requests: discovery.mode === "live" ? 1 : 0,
        maxAttempts: 3,
        requestTimeoutMs: 10_000,
        withdrawalConfirmationsRequired: 2,
        retainedImmutableRuns: MAX_RETAINED_RUNS
      },
      attemptsUsed: discovery.attempts,
      humanReviews: 0,
      productionTargetsChanged: false,
      productionDigests: productionAfterOperationalWrites,
      activation: "isolated_only_live_disabled_by_default",
      permissionStatus: "pending_external_confirmation",
      permissionBlocker:
        "MIT Learn API/offering terms have not been reconciled for this exact listing-metadata use. Anonymous HTTP access is not treated as permission.",
      lifecycleLimitation:
        "The bounded offset=0 page is not a complete snapshot and cannot confirm withdrawals. Per-ID refresh or authorized snapshot coverage remains unimplemented.",
      decisionGradeManifestChanged: false,
      seoOutputsChanged: false
    };
    writeJsonAtomic(reportPath, report, boundary);
    if (evidenceOutput) writeJsonAtomic(evidenceOutput, report, boundary);
    writeJsonAtomic(
      latestPath,
      {
        runId,
        runDirectory: relative(workspace, runDirectory),
        report: relative(workspace, reportPath),
        audit: relative(workspace, auditPath),
        candidates: relative(workspace, stagingPath),
        receipt: relative(workspace, receiptPath)
      },
      boundary
    );
    pruneRunHistory(resolve(workspace, "runs"), boundary);
    assertProductionUnchanged(productionBefore);
    return report;
  } finally {
    closeSync(lock);
    boundary.assertWritable(lockPath);
    if (existsSync(lockPath)) rmSync(lockPath);
  }
};

run()
  .then((report) => console.log(JSON.stringify(report, null, 2)))
  .catch((error) => {
    console.error(
      `[run:authorized-ingestion] ${
        error instanceof Error ? error.message : String(error)
      }`
    );
    process.exit(1);
  });
