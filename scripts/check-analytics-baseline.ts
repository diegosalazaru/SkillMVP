import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();

function read(relativePath: string) {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function sourceFiles(directory: string): string[] {
  const absoluteDirectory = path.join(root, directory);

  return readdirSync(absoluteDirectory).flatMap((entry) => {
    const relativePath = path.join(directory, entry);
    const absolutePath = path.join(root, relativePath);

    if (statSync(absolutePath).isDirectory()) {
      return sourceFiles(relativePath);
    }

    return /\.(?:ts|tsx|js|jsx)$/.test(entry) ? [relativePath] : [];
  });
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

const removedPlausibleFiles = [
  "src/components/seo/AnalyticsLoader.tsx",
  "src/config/analytics.ts"
];

for (const relativePath of removedPlausibleFiles) {
  assert(!existsSync(path.join(root, relativePath)), `${relativePath} must remain removed.`);
}

const runtimeFiles = [...sourceFiles("app"), ...sourceFiles("src")];
const runtimeSource = runtimeFiles.map((relativePath) => read(relativePath)).join("\n");
const layout = read("app/layout.tsx");
const packageJson = JSON.parse(read("package.json")) as {
  dependencies?: Record<string, string>;
};

assert(
  typeof packageJson.dependencies?.["@vercel/analytics"] === "string",
  "@vercel/analytics must be a production dependency."
);
assert(
  (layout.match(/from ["']@vercel\/analytics\/next["']/g) ?? []).length === 1,
  "Root layout must import @vercel/analytics/next exactly once."
);
assert(
  (layout.match(/<Analytics\s*\/>/g) ?? []).length === 1,
  "Root layout must render <Analytics /> exactly once."
);
assert(!/plausible\.io/i.test(runtimeSource), "Plausible must not be loaded by runtime source.");
assert(
  !/NEXT_PUBLIC_PLAUSIBLE_DOMAIN/.test(runtimeSource),
  "The inactive Plausible environment variable must not remain in runtime source."
);
assert(
  !/@vercel\/analytics\/(?:react|server)/.test(runtimeSource),
  "Only the Next.js pageview integration is allowed in this phase."
);
assert(
  (runtimeSource.match(/@vercel\/analytics/g) ?? []).length === 1,
  "No additional Vercel Analytics imports or custom-event paths are allowed in this phase."
);

console.log("Analytics baseline checks passed.");
