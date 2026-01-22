"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/app/components/common/Search-bar";
import BranchesTable from "@/app/components/branches-table";

import { branchesData } from "@/app/Branchmanagement/data";

export default function BranchesPage() {
  const [query, setQuery] = useState("");

  const branches = branchesData;

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return branches.filter((c) => c.name.toLowerCase().includes(q) || c.phone.includes(q));
  }, [branches, query]);

  return (
    <div className="space-y-4">
      <SearchBar
        placeholder="Branches..."
        value={query}
        onChange={setQuery}
        onFilter={() => console.log("open filter popup")}
        debounceMs={200}
      />

      <BranchesTable branches={filtered} />
    </div>
  );
}
