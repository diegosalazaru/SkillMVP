import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  linkSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

import {
  applyMachinePublicationPolicy,
  atomicCompanionPaths,
  createWriteBoundary,
  ingestCandidateInput,
  promoteCandidates,
  validateCandidateBatch,
  withdrawAcceptedBySourceIdentity,
  writeJsonAtomic
} from "./lib/candidate-pipeline";
import {
  isSourceWideAnomaly,
  reconcileWithdrawalState
} from "./lib/authorized-cycle";
import {
  buildMitOcxCandidateInput,
  fetchMitOcxCourses,
  MitOcxResource,
  MIT_OCW_POLICY,
  MIT_OCW_SOURCE_ID
} from "./lib/mit-learn-ocw";

const AS_OF = "2026-09-21";
const DECIDED_AT = `${AS_OF}T12:34:56.000Z`;

const resource = (
  id: number,
  overrides: Partial<MitOcxResource> = {}
): MitOcxResource => ({
  id,
  title: `Source course ${id}`,
  url: `https://ocw.mit.edu/courses/fixture-${id}/`,
  last_modified: "2026-09-20T12:00:00Z",
  published: true,
  free: true,
  license_cc: true,
  resource_type: "course",
  platform: { code: "ocw", name: "MIT OpenCourseWare" },
  offered_by: { code: "ocw", name: "MIT OpenCourseWare" },
  topics: [{ id: 1, name: "Business & Management", parent: null }],
  ocw_topics: ["Management"],
  runs: [{ published: true }],
  ...overrides
});

const makeDecidedBatch = (resources: unknown[]) =>
  applyMachinePublicationPolicy(
    ingestCandidateInput(
      buildMitOcxCandidateInput(resources, {
        asOf: AS_OF,
        receivedAt: DECIDED_AT,
        batchId: "authorized-ingestion-regression"
      })
    ),
    { asOf: AS_OF, decidedAt: DECIDED_AT, policy: MIT_OCW_POLICY }
  );

const readJson = <T>(path: string): T =>
  JSON.parse(readFileSync(path, "utf8")) as T;

const runCli = (
  cwd: string,
  args: string[],
  extraEnvironment: Record<string, string> = {}
) =>
  spawnSync(
    process.execPath,
    [
      resolve("node_modules/tsx/dist/cli.mjs"),
      resolve("scripts/run-authorized-ingestion.ts"),
      ...args
    ],
    {
      cwd,
      encoding: "utf8",
      env: {
        ...process.env,
        SKILLMVP_MIT_LEARN_LIVE_ACCESS_AUTHORIZED: "0",
        ...extraEnvironment
      }
    }
  );

const prepareCliFixture = (root: string) => {
  mkdirSync(join(root, "data", "normalized"), { recursive: true });
  mkdirSync(join(root, "data", "staging"), { recursive: true });
  copyFileSync(
    resolve("data/normalized/courses.json"),
    join(root, "data", "normalized", "courses.json")
  );
  copyFileSync(
    resolve("data/normalized/course-source-metadata.json"),
    join(root, "data", "normalized", "course-source-metadata.json")
  );
  copyFileSync(
    resolve("data/decision-grade-manifest.json"),
    join(root, "data", "decision-grade-manifest.json")
  );
};

const protectedBytes = (root: string) => ({
  catalog: readFileSync(join(root, "data", "normalized", "courses.json")),
  metadata: readFileSync(
    join(root, "data", "normalized", "course-source-metadata.json")
  ),
  manifest: readFileSync(join(root, "data", "decision-grade-manifest.json"))
});

const assertProtectedBytesEqual = (
  left: ReturnType<typeof protectedBytes>,
  right: ReturnType<typeof protectedBytes>
) => {
  assert.deepEqual(right.catalog, left.catalog);
  assert.deepEqual(right.metadata, left.metadata);
  assert.deepEqual(right.manifest, left.manifest);
};

const removeDirectoryLink = (path: string) => {
  if (process.platform === "win32") rmdirSync(path);
  else unlinkSync(path);
};

const main = async () => {
  const taskTemp = mkdtempSync(join(tmpdir(), "skillmvp-authorized-ingestion-"));
  try {
    const atomicRoot = join(taskTemp, "atomic-boundary");
    const protectedDirectory = join(atomicRoot, "protected");
    const protectedPath = join(protectedDirectory, "evidence.json");
    const atomicTarget = join(atomicRoot, "output.json");
    mkdirSync(protectedDirectory, { recursive: true });
    writeFileSync(protectedPath, "protected evidence\n", "utf8");
    writeJsonAtomic(atomicTarget, { status: "original" });
    const protectedBeforeAtomicAttacks = readFileSync(protectedPath);
    const targetBeforeAtomicAttacks = readFileSync(atomicTarget);
    const atomicBoundary = createWriteBoundary({ allowedRoot: atomicRoot });
    const companions = atomicCompanionPaths(atomicTarget);
    for (const companionPath of [
      companions.temporaryPath,
      companions.backupPath
    ]) {
      symlinkSync(
        protectedDirectory,
        companionPath,
        process.platform === "win32" ? "junction" : "dir"
      );
      assert.throws(
        () =>
          writeJsonAtomic(
            atomicTarget,
            { status: "attacker-controlled" },
            atomicBoundary
          ),
        /pre-existing link/
      );
      assert.deepEqual(readFileSync(protectedPath), protectedBeforeAtomicAttacks);
      assert.deepEqual(readFileSync(atomicTarget), targetBeforeAtomicAttacks);
      removeDirectoryLink(companionPath);
    }

    const stagingPath = join(taskTemp, "candidates.json");
    const catalogPath = join(taskTemp, "courses.json");
    const metadataPath = join(taskTemp, "course-source-metadata.json");
    const receiptPath = join(taskTemp, "receipt.json");
    copyFileSync(resolve("data/normalized/courses.json"), catalogPath);
    copyFileSync(
      resolve("data/normalized/course-source-metadata.json"),
      metadataPath
    );
    const originalCount = readJson<unknown[]>(catalogPath).length;

    const initial = makeDecidedBatch([resource(9001), resource(9002)]);
    assert.ok(
      initial.candidates.every(
        (candidate) =>
          candidate.machineDecision?.outcome === "publish" &&
          candidate.humanReview === null
      )
    );
    writeJsonAtomic(stagingPath, initial);
    const first = promoteCandidates({
      stagingPath,
      candidateIds: initial.candidates.map((candidate) => candidate.candidateId),
      catalogPath,
      metadataPath,
      receiptPath,
      asOf: AS_OF,
      machinePolicy: MIT_OCW_POLICY
    });
    assert.equal(first.inserted, 2);
    assert.equal(readJson<unknown[]>(catalogPath).length, originalCount + 2);

    const second = promoteCandidates({
      stagingPath,
      candidateIds: initial.candidates.map((candidate) => candidate.candidateId),
      catalogPath,
      metadataPath,
      asOf: AS_OF,
      machinePolicy: MIT_OCW_POLICY
    });
    assert.equal(second.unchanged, 2);

    const changed = makeDecidedBatch([
      resource(9001, { title: "Source course 9001 — changed fact" })
    ]);
    writeJsonAtomic(stagingPath, changed);
    const update = promoteCandidates({
      stagingPath,
      candidateIds: [changed.candidates[0].candidateId],
      catalogPath,
      metadataPath,
      asOf: AS_OF,
      machinePolicy: MIT_OCW_POLICY
    });
    assert.equal(update.updated, 1);

    const invalidPricing = makeDecidedBatch([resource(9003, { free: false })]);
    assert.equal(invalidPricing.candidates[0].disposition, "quarantined");
    assert.ok(
      invalidPricing.candidates[0].exceptionCodes.includes("pricing_unactionable")
    );

    const mixed = makeDecidedBatch([
      resource(9010),
      { ...resource(9011), id: undefined },
      { ...resource(9012), topics: {} },
      { ...resource(9013), runs: {} },
      { ...resource(9014), runs: undefined }
    ]);
    assert.equal(mixed.candidates.length, 5);
    const validMixed = mixed.candidates.find(
      (candidate) => candidate.sourceIdentity.providerCourseId === "9010"
    )!;
    const missingIdentity = mixed.candidates.find(
      (candidate) => candidate.sourceIdentity.providerCourseId == null
    )!;
    assert.equal(validMixed.machineDecision?.outcome, "publish");
    for (const malformed of mixed.candidates.filter(
      (candidate) => candidate !== validMixed
    )) {
      assert.equal(malformed.machineDecision?.outcome, "quarantine");
    }
    assert.ok(
      missingIdentity.exceptionCodes.includes("missing_provider_identity")
    );
    assert.equal(
      mixed.candidates.find(
        (candidate) => candidate.sourceIdentity.providerCourseId === "9014"
      )!.availability.status,
      "unknown"
    );

    const duplicateTuple = makeDecidedBatch([
      resource(9020),
      resource(9020, { url: "https://ocw.mit.edu/courses/fixture-9020-b/" })
    ]);
    assert.ok(
      duplicateTuple.candidates.every((candidate) =>
        candidate.exceptionCodes.includes("duplicate_identity")
      )
    );

    const identityAliasInput = buildMitOcxCandidateInput(
      [
        resource(9001, {
          url: "https://ocw.mit.edu/courses/fixture-9001-alias/"
        })
      ],
      {
      asOf: AS_OF,
      receivedAt: DECIDED_AT,
      batchId: "identity-alias"
      }
    );
    identityAliasInput.candidates[0].candidateId = "mit-learn-ocw:9001-alias";
    identityAliasInput.candidates[0].proposedCourseId = "mit-ocw-9001-alias";
    (identityAliasInput.candidates[0].course as { id: string }).id =
      "mit-ocw-9001-alias";
    identityAliasInput.candidates[0].sourceMetadata.courseId =
      "mit-ocw-9001-alias";
    const identityAlias = applyMachinePublicationPolicy(
      ingestCandidateInput(identityAliasInput),
      { asOf: AS_OF, decidedAt: DECIDED_AT, policy: MIT_OCW_POLICY }
    );
    writeJsonAtomic(stagingPath, identityAlias);
    assert.throws(
      () =>
        promoteCandidates({
          stagingPath,
          candidateIds: [identityAlias.candidates[0].candidateId],
          catalogPath,
          metadataPath,
          asOf: AS_OF,
          machinePolicy: MIT_OCW_POLICY
        }),
      /Provider identity collision/
    );

    const tampered = structuredClone(makeDecidedBatch([resource(9030)]));
    (tampered.candidates[0].course as { title: string }).title =
      "Changed after automatic decision";
    assert.equal(
      validateCandidateBatch(tampered, { asOf: AS_OF }).batch.candidates[0]
        .machineDecision,
      null
    );

    assert.equal(isSourceWideAnomaly(2_586, 0), true);
    assert.equal(isSourceWideAnomaly(2_586, 1_000), true);
    assert.equal(isSourceWideAnomaly(2_586, 2_500), false);

    const firstMissing = reconcileWithdrawalState({
      previous: {
        sourceId: MIT_OCW_SOURCE_ID,
        totalAvailable: 2,
        lastSuccessfulAt: "2026-09-20",
        records: {
          "9001": {
            status: "active",
            lastSeenAt: "2026-09-20",
            missingConfirmations: 0
          }
        }
      },
      sourceId: MIT_OCW_SOURCE_ID,
      totalAvailable: 1,
      observedProviderIds: [],
      observedAt: AS_OF,
      providerHealthy: true,
      completeSnapshot: true
    });
    const confirmed = reconcileWithdrawalState({
      previous: firstMissing.state,
      sourceId: MIT_OCW_SOURCE_ID,
      totalAvailable: 1,
      observedProviderIds: [],
      observedAt: "2026-09-22",
      providerHealthy: true,
      completeSnapshot: true
    });
    assert.deepEqual(confirmed.withdrawn, ["9001"]);
    assert.equal(
      withdrawAcceptedBySourceIdentity({
        catalogPath,
        metadataPath,
        sourceId: MIT_OCW_SOURCE_ID,
        providerCourseIds: confirmed.withdrawn,
        withdrawnAt: "2026-09-22"
      }).changed,
      1
    );
    const outage = reconcileWithdrawalState({
      previous: firstMissing.state,
      sourceId: MIT_OCW_SOURCE_ID,
      totalAvailable: 0,
      observedProviderIds: [],
      observedAt: "2026-09-22",
      providerHealthy: false,
      completeSnapshot: true
    });
    assert.equal(outage.state.records["9001"].missingConfirmations, 1);
    assert.equal(outage.withdrawn.length, 0);

    let attempts = 0;
    const eventuallySuccessful = (async () => {
      attempts += 1;
      if (attempts < 3) return new Response("temporary", { status: 503 });
      return Response.json({
        count: 1,
        next: null,
        previous: null,
        results: [resource(9040)]
      });
    }) as typeof fetch;
    assert.equal(
      (
        await fetchMitOcxCourses({
          limit: 20,
          maxAttempts: 3,
          timeoutMs: 100,
          fetchImpl: eventuallySuccessful
        })
      ).attempts,
      3
    );
    let unauthorizedAttempts = 0;
    const unauthorized = (async () => {
      unauthorizedAttempts += 1;
      return new Response("unauthorized", { status: 401 });
    }) as typeof fetch;
    await assert.rejects(
      fetchMitOcxCourses({
        limit: 20,
        maxAttempts: 3,
        timeoutMs: 100,
        fetchImpl: unauthorized
      }),
      /HTTP 401.*1 attempt/
    );
    assert.equal(unauthorizedAttempts, 1);

    const cliRoot = join(taskTemp, "cli");
    prepareCliFixture(cliRoot);
    const snapshotPath = join(cliRoot, "snapshot.json");
    const snapshot = {
      count: 20,
      next: null,
      previous: null,
      results: Array.from({ length: 20 }, (_, index) => resource(9100 + index))
    };
    writeJsonAtomic(snapshotPath, snapshot);
    const beforeAttack = protectedBytes(cliRoot);
    const overwriteAttempt = runCli(cliRoot, [
      "--input-snapshot",
      "snapshot.json",
      "--limit",
      "20",
      "--workspace",
      "data/staging/review",
      "--evidence-output",
      "data/normalized/courses.json"
    ]);
    assert.notEqual(overwriteAttempt.status, 0);
    assert.match(overwriteAttempt.stderr, /outside isolated boundary/);
    assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));
    assert.equal(existsSync(join(cliRoot, "data", "staging", "review")), false);

    for (const collisionTarget of [
      "data/staging/review/source-state.json",
      "data/staging/review/latest.json",
      "data/staging/review/accepted/courses.json"
    ]) {
      const collisionAttempt = runCli(cliRoot, [
        "--input-snapshot",
        "snapshot.json",
        "--limit",
        "20",
        "--workspace",
        "data/staging/review",
        "--evidence-output",
        collisionTarget
      ]);
      assert.notEqual(collisionAttempt.status, 0);
      assert.match(collisionAttempt.stderr, /destinations must be unique/);
      assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));
      assert.equal(existsSync(join(cliRoot, "data", "staging", "review")), false);
    }

    const linkPath = join(cliRoot, "data", "staging", "normalized-link");
    let linkCreated = false;
    try {
      symlinkSync(
        join(cliRoot, "data", "normalized"),
        linkPath,
        process.platform === "win32" ? "junction" : "dir"
      );
      linkCreated = true;
    } catch (error) {
      if (process.platform !== "win32") throw error;
    }
    if (linkCreated) {
      const aliasAttempt = runCli(cliRoot, [
        "--input-snapshot",
        "snapshot.json",
        "--limit",
        "20",
        "--workspace",
        "data/staging/normalized-link"
      ]);
      assert.notEqual(aliasAttempt.status, 0);
      assert.match(aliasAttempt.stderr, /outside isolated boundary/);
      assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));
      rmSync(linkPath);
    }

    const liveBlocked = runCli(cliRoot, [
      "--live",
      "--limit",
      "20",
      "--workspace",
      "data/staging/review"
    ]);
    assert.notEqual(liveBlocked.status, 0);
    assert.match(liveBlocked.stderr, /Live MIT Learn access is disabled/);
    assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));

    const firstRun = runCli(cliRoot, [
      "--input-snapshot",
      "snapshot.json",
      "--limit",
      "20",
      "--as-of",
      AS_OF,
      "--workspace",
      "data/staging/review"
    ]);
    assert.equal(firstRun.status, 0, firstRun.stderr);
    snapshot.results[0] = resource(9100, {
      title: "Source course 9100 — changed fact"
    });
    writeJsonAtomic(snapshotPath, snapshot);
    const secondRun = runCli(cliRoot, [
      "--input-snapshot",
      "snapshot.json",
      "--limit",
      "20",
      "--as-of",
      AS_OF,
      "--workspace",
      "data/staging/review"
    ]);
    assert.equal(secondRun.status, 0, secondRun.stderr);
    const thirdRun = runCli(cliRoot, [
      "--input-snapshot",
      "snapshot.json",
      "--limit",
      "20",
      "--as-of",
      "2026-09-22",
      "--workspace",
      "data/staging/review"
    ]);
    assert.equal(thirdRun.status, 0, thirdRun.stderr);

    const runsDirectory = join(cliRoot, "data", "staging", "review", "runs");
    const runIds = readdirSync(runsDirectory).sort();
    assert.equal(runIds.length, 3);
    const runArtifacts = runIds.map((runId) => ({
      runId,
      audit: readJson<{
        receivedAt: string;
        decidedAt: string;
        decisions: unknown[];
      }>(join(runsDirectory, runId, "audit.json")),
      candidates: readJson<{
        candidates: Array<{
          discoveredAt: string;
          course: { title: string };
        }>;
      }>(join(runsDirectory, runId, "candidates.json")),
      receipt: readJson<{ updated: number; refreshed: number }>(
        join(runsDirectory, runId, "promotion-receipt.json")
      )
    }));
    assert.equal(new Set(runArtifacts.map((item) => item.runId)).size, 3);
    assert.ok(
      runArtifacts.every(
        (item) =>
          item.audit.decisions.length === 20 &&
          item.audit.receivedAt === item.audit.decidedAt &&
          !item.audit.decidedAt.endsWith("T00:00:00.000Z")
      )
    );
    assert.equal(
      runArtifacts[0].candidates.candidates[0].course.title,
      "Source course 9100"
    );
    assert.equal(
      runArtifacts[1].candidates.candidates[0].course.title,
      "Source course 9100 — changed fact"
    );
    assert.equal(runArtifacts[1].receipt.updated, 1);
    assert.equal(runArtifacts[1].receipt.refreshed, 19);
    assert.equal(runArtifacts[2].receipt.updated, 0);
    assert.equal(runArtifacts[2].receipt.refreshed, 20);
    assert.equal(
      runArtifacts[2].candidates.candidates[0].discoveredAt,
      AS_OF
    );
    const priorAuditBytes = new Map(
      runIds.map((runId) => [
        runId,
        readFileSync(join(runsDirectory, runId, "audit.json"))
      ])
    );
    const assertPriorAuditsUnchanged = () => {
      assert.deepEqual(readdirSync(runsDirectory).sort(), runIds);
      for (const [runId, bytes] of priorAuditBytes) {
        assert.deepEqual(
          readFileSync(join(runsDirectory, runId, "audit.json")),
          bytes
        );
      }
    };

    const exportsPath = join(cliRoot, "data", "staging", "review", "exports");
    symlinkSync(
      runsDirectory,
      exportsPath,
      process.platform === "win32" ? "junction" : "dir"
    );
    const linkedExportAttempt = runCli(cliRoot, [
      "--input-snapshot",
      "snapshot.json",
      "--limit",
      "20",
      "--workspace",
      "data/staging/review",
      "--evidence-output",
      `data/staging/review/exports/${runIds[0]}/audit.json`
    ]);
    assert.notEqual(linkedExportAttempt.status, 0);
    assert.match(
      linkedExportAttempt.stderr,
      /Export path contains a pre-existing link/
    );
    assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));
    assertPriorAuditsUnchanged();
    removeDirectoryLink(exportsPath);

    mkdirSync(exportsPath, { recursive: true });
    const hardLinkedExport = join(exportsPath, "historical-audit.json");
    linkSync(
      join(runsDirectory, runIds[0], "audit.json"),
      hardLinkedExport
    );
    const hardLinkedExportAttempt = runCli(cliRoot, [
      "--input-snapshot",
      "snapshot.json",
      "--limit",
      "20",
      "--workspace",
      "data/staging/review",
      "--evidence-output",
      "data/staging/review/exports/historical-audit.json"
    ]);
    assert.notEqual(hardLinkedExportAttempt.status, 0);
    assert.match(
      hardLinkedExportAttempt.stderr,
      /cannot share file identity with operational or historical evidence/
    );
    assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));
    assertPriorAuditsUnchanged();
    assertProtectedBytesEqual(beforeAttack, protectedBytes(cliRoot));

    console.log(
      "[check:authorized-ingestion] PASS — offline atomic writes reject pre-existing temporary/backup links and create temporaries exclusively; CLI isolation rejects protected, colliding, canonical alias, linked export-root, and hard-linked historical audit targets without byte changes; missing/malformed identities and records quarantine independently; source tuples are unique; immutable same-day run evidence survives updates; refreshes are distinct from changed facts; live access defaults off; retries, anomaly stops, and withdrawal safety remain bounded."
    );
  } finally {
    rmSync(taskTemp, { recursive: true, force: true });
  }
};

main().catch((error) => {
  console.error(
    `[check:authorized-ingestion] ${
      error instanceof Error ? error.message : String(error)
    }`
  );
  process.exit(1);
});
