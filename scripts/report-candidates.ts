import { existsSync } from "node:fs";
import { resolve } from "node:path";

import { currentDate, getArgument, runCli } from "./lib/cli-args";
import {
  buildBatchReport,
  PromotionReceipt,
  readCandidateFile
} from "./lib/candidate-pipeline";

runCli("report:candidates", () => {
  const stagingPath = resolve(getArgument("--staging", { required: true })!);
  const receiptArgument = getArgument("--promotion-receipt");
  const receiptPath = receiptArgument ? resolve(receiptArgument) : undefined;
  const receipt =
    receiptPath && existsSync(receiptPath)
      ? (readCandidateFile(receiptPath) as PromotionReceipt)
      : undefined;
  const report = buildBatchReport(
    readCandidateFile(stagingPath),
    { asOf: getArgument("--as-of", { fallback: currentDate() })! },
    receipt
  );
  console.log(JSON.stringify(report, null, 2));
});
