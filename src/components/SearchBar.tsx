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
    <div className="space-y-3">
      <form
        className="flex flex-col gap-3 sm:flex-row sm:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(value);
        }}
      >
        <input
          type="search"
          aria-label="Search available skills"
          className="min-h-12 w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-base shadow-sm focus:border-slate-400 focus:outline-none sm:text-sm"
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          type="submit"
          className="min-h-12 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 sm:shrink-0"
        >
          Search skills
        </button>
      </form>
      {feedback ? <p className="text-sm text-amber-700">{feedback}</p> : null}
    </div>
  );
};
