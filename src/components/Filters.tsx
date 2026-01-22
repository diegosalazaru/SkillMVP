"use client";

type FiltersState = {
  platform: string;
  level: string;
  priceType: string;
};

type FiltersProps = {
  value: FiltersState;
  onChange: (next: FiltersState) => void;
};

const platforms = ["All", "Coursera", "Udemy", "Microsoft Learn", "edX"];
const levels = ["All", "Beginner", "Intermediate", "Advanced"];
const prices = ["All", "Free", "Paid"];

export const Filters = ({ value, onChange }: FiltersProps) => {
  return (
    <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Plataforma
        <select
          value={value.platform}
          onChange={(event) =>
            onChange({ ...value, platform: event.target.value })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          {platforms.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
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
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2 text-sm font-medium text-slate-600">
        Precio
        <select
          value={value.priceType}
          onChange={(event) =>
            onChange({ ...value, priceType: event.target.value })
          }
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700"
        >
          {prices.map((price) => (
            <option key={price} value={price}>
              {price}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};
