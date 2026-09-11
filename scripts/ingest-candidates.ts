import { resolve } from "node:path";

import { currentDate, getArgument, runCli } from "./lib/cli-args";
import {
  assertSafeStagingTarget,
  ingestCandidateInput,
  readCandidateFile,
  writeJsonAtomic
} from "./lib/candidate-pipeline";

runCli("ingest:candidates", () => {
  const inputPath = resolve(getArgument("--input", { required: true })!);
  const outputPath = resolve(
    getArgument("--output", { fallback: "data/staging/candidates.json" })!
  );
  assertSafeStagingTarget(outputPath);
  const staging = ingestCandidateInput(readCandidateFile(inputPath));
  writeJsonAtomic(outputPath, staging);
  console.log(
    `[ingest:candidates] Staged ${staging.candidates.length} candidates from batch ${staging.batchId} at ${outputPath} (${currentDate()}).`
  );
});
