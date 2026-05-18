"use client";

type FiltersState = {
  platform: string;
  level: string;
  priceModel: string;
  language: string;
};

type FiltersProps = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
  options?: {
    platforms: string[];
    levels: string[];
    prices: { value: string; label: string }[];
    languages: string[];
  };
};

const platforms = ["All", "Coursera", "Udemy", "Microsoft Learn", "edX"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const prices = [
  { value: "All", label: "All" },
  { value: "free", label: "Free" },
  { value: "paid_once", label: "One-time payment" },
  { value: "subscription", label: "Subscription" },
  { value: "unknown", label: "Unknown" }
];
const languages = ["All"];

export const Filters = ({ value, onChange, options }: FiltersProps) => {
  const platformOptions = options?.platforms ?? platforms;
  const levelOptions = options?.levels ?? levels;
  const priceOptions = options?.prices ?? prices;
  const languageOptions = options?.languages ?? languages;

  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Plataforma
        <select
          value={value.platform}
          onChange={(event) =>
            onChange({ ...value, platform: event.target.value })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform === "All" ? "Todas" : platform}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Nivel
        <select
          value={value.level}
          onChange={(event) => onChange({ ...value, level: event.target.value })}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          {levelOptions.map((level) => (
            <option key={level} value={level}>
              {level === "All" ? "All" : level}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Precio
        <select
          value={value.priceModel}
          onChange={(event) =>
            onChange({ ...value, priceModel: event.target.value })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          {priceOptions.map((price) => (
            <option key={price.value} value={price.value}>
              {price.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Idioma
        <select
          value={value.language}
          onChange={(event) =>
            onChange({ ...value, language: event.target.value })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          {languageOptions.map((language) => (
            <option key={language} value={language}>
              {language === "All" ? "All" : language}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
