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
    <div className="grid min-w-0 gap-5 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
      <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        Platform
        <select
          value={value.platform}
          onChange={(event) =>
            onChange({ ...value, platform: event.target.value })
          }
          className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none"
        >
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform === "All" ? "All" : platform}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        Level
        <select
          value={value.level}
          onChange={(event) => onChange({ ...value, level: event.target.value })}
          className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none"
        >
          {levelOptions.map((level) => (
            <option key={level} value={level}>
              {level === "All" ? "All" : level}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        Price
        <select
          value={value.priceModel}
          onChange={(event) =>
            onChange({ ...value, priceModel: event.target.value })
          }
          className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none"
        >
          {priceOptions.map((price) => (
            <option key={price.value} value={price.value}>
              {price.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
        Language
        <select
          value={value.language}
          onChange={(event) =>
            onChange({ ...value, language: event.target.value })
          }
          className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-slate-800 shadow-sm focus:border-blue-400 focus:outline-none"
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
