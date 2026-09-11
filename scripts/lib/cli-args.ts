export const getArgument = (
  name: string,
  options: { required?: boolean; fallback?: string } = {}
) => {
  const index = process.argv.indexOf(name);
  const value = index >= 0 ? process.argv[index + 1] : options.fallback;
  if ((!value || value.startsWith("--")) && options.required) {
    throw new Error(`Missing required argument: ${name}`);
  }
  return value;
};

export const currentDate = () => new Date().toISOString().slice(0, 10);

export const runCli = (label: string, run: () => void) => {
  try {
    run();
  } catch (error) {
    console.error(`[${label}] ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};
