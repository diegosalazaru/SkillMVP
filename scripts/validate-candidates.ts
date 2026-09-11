import { resolve } from "node:path";

import { currentDate, getArgument, runCli } from "./lib/cli-args";
import {
  assertSafeStagingTarget,
  buildBatchReport,
  readCandidateFile,
  validateCandidateBatch,
  writeJsonAtomic
} from "./lib/candidate-pipeline";

runCli("validate:candidates", () => {
  const stagingPath = resolve(getArgument("--staging", { required: true })!);
  const asOf = getArgument("--as-of", { fallback: currentDate() })!;
  assertSafeStagingTarget(stagingPath);
  const input = readCandidateFile(stagingPath);
  const validated = validateCandidateBatch(input, { asOf });
  writeJsonAtomic(stagingPath, validated.batch);
  const report = buildBatchReport(validated.batch, { asOf });
  console.log(JSON.stringify(report, null, 2));
});
