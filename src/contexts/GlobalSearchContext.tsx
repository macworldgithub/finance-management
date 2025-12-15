"use client";

import React, { createContext, useContext, useMemo, useState } from "react";

type GlobalSearchContextValue = {
  searchText: string;
  setSearchText: (value: string) => void;
  clearSearchText: () => void;
};

const GlobalSearchContext = createContext<GlobalSearchContextValue | undefined>(
  undefined
);

export function GlobalSearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [searchText, setSearchText] = useState("");

  const value = useMemo<GlobalSearchContextValue>(
    () => ({
      searchText,
      setSearchText,
      clearSearchText: () => setSearchText(""),
    }),
    [searchText]
  );

  return (
    <GlobalSearchContext.Provider value={value}>
      {children}
    </GlobalSearchContext.Provider>
  );
}

export function useGlobalSearch() {
  const ctx = useContext(GlobalSearchContext);
  if (!ctx) throw new Error("useGlobalSearch must be used within GlobalSearchProvider");
  return ctx;
}
