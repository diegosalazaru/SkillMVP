"use client";

import { useState } from "react";

type SearchBarProps = {
  placeholder?: string;
  onSearch: (value: string) => void;
  feedback?: string | null;
};

export const SearchBar = ({ placeholder, onSearch, feedback }: SearchBarProps) => {
  const [value, setValue] = useState("");

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus:border-slate-400 focus:outline-none"
        placeholder={placeholder}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <button
        type="button"
        onClick={() => onSearch(value)}
        className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
      >
        Search
      </button>
      {feedback ? <p className="text-sm text-amber-700">{feedback}</p> : null}
    </div>
  );
};
