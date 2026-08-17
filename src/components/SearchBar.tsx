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
        className="flex flex-col gap-3 rounded-2xl bg-slate-100/80 p-2 sm:flex-row sm:items-center"
        onSubmit={(event) => {
          event.preventDefault();
          onSearch(value);
        }}
      >
        <input
          type="search"
          aria-label="Search available skills"
          className="min-h-14 w-full min-w-0 rounded-xl border border-slate-200/80 bg-white px-4 py-3 text-base text-slate-950 shadow-sm placeholder:text-slate-400 focus:border-blue-400 focus:outline-none sm:px-5"
          placeholder={placeholder}
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button
          type="submit"
          className="min-h-14 rounded-xl bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-600 sm:shrink-0 sm:px-8"
        >
          Search skills
        </button>
      </form>
      {feedback ? <p className="px-1 text-sm font-medium text-amber-700">{feedback}</p> : null}
    </div>
  );
};
