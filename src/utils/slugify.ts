export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

const TITLE_ACRONYMS: Record<string, string> = {
  ai: "AI"
};

export const titleFromSlug = (slug: string) =>
  slug
    .split("-")
    .map(
      (word) =>
        TITLE_ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
