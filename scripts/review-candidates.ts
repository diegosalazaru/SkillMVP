import { resolve } from "node:path";

import { currentDate, getArgument, runCli } from "./lib/cli-args";
import {
  assertSafeStagingTarget,
  markCandidatesReviewed,
  readCandidateFile,
  writeJsonAtomic
} from "./lib/candidate-pipeline";

runCli("review:candidates", () => {
  const stagingPath = resolve(getArgument("--staging", { required: true })!);
  const asOf = getArgument("--as-of", { fallback: currentDate() })!;
  const candidateIds = getArgument("--ids", { required: true })!
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  assertSafeStagingTarget(stagingPath);
  const reviewed = markCandidatesReviewed(readCandidateFile(stagingPath), {
    candidateIds,
    reviewedAt: getArgument("--reviewed-at", { fallback: asOf })!,
    note: getArgument("--note", { required: true })!,
    asOf
  });
  writeJsonAtomic(stagingPath, reviewed);
  console.log(
    `[review:candidates] Recorded human review for ${candidateIds.length} candidates in ${stagingPath}.`
  );
});
