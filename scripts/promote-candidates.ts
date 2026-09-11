import { resolve } from "node:path";

import { currentDate, getArgument, runCli } from "./lib/cli-args";
import { promoteCandidates } from "./lib/candidate-pipeline";

runCli("promote:candidates", () => {
  const ids = getArgument("--ids", { required: true })!
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const receipt = promoteCandidates({
    stagingPath: resolve(getArgument("--staging", { required: true })!),
    candidateIds: ids,
    receiptPath: resolve(
      getArgument("--receipt", {
        fallback: "data/staging/promotion-receipt.json"
      })!
    ),
    asOf: getArgument("--as-of", { fallback: currentDate() })!
  });
  console.log(JSON.stringify(receipt, null, 2));
});
