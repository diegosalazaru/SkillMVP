console.error(
  "[ingest:edx] Disabled: legacy discovery cannot publish directly. Convert bounded provider output to the candidate envelope and use ingest:candidates."
);
process.exit(1);
