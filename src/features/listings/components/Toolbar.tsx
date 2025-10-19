"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { Card } from "@/shared/components/Card";
import { Input } from "@/shared/components/Input";
import { CostFilter } from "@/features/listings/components/CostFilter";
import { FilterDropdown } from "@/features/listings/components/FilterDropdown";

interface FilterOptions {
  PriceMin: number;
  PriceMax: number;
  gpuType: string;
  location: string;
  sortBy: string;
}

export function ListingsToolbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    PriceMin: 0,
    PriceMax: 1000,
    gpuType: "all", 
    location: "all",
    sortBy: "newest"
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
    console.log("Searching for:", searchQuery, "with filters:", filters);
  };

  const updateFilter = (updates: Partial<FilterOptions>) => {
    setFilters(prev => ({ ...prev, ...updates }));
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => value !== "all").length;
  };

  const getCurrentLocation = () => {
    if (filters.location === "all") return "All Locations";
    return filters.location;
  };

  return (
    <Card className="mb-4 p-4 border-stroke">
      <div className="flex flex-col gap-4">
        {/* Search Bar and Actions Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center">
          <form onSubmit={handleSearch} className="flex-1 w-full">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search GPUs, models, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
              />
              <Button
                type="submit"
                variant="highlight"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-3"
              >
                Search
              </Button>
            </div>
          </form>
        </div>

        {/* Filters and Current Location Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex gap-2">
            <CostFilter
              min={0}
              max={1000}
              value1={filters.PriceMin}
              value2={filters.PriceMax}
              onChange={(value1: number, value2: number) => updateFilter({ PriceMin: value1, PriceMax: value2 })}
            />
          </div>
          <div className="flex gap-2">
          <FilterDropdown label="VRAM" className="m-0" options={[{value: "8", label: "8GB"}, {value: "11", label: "11GB"}, { value: "12", label: "12GB" }, { value: "16", label: "16GB" }, { value: "24", label: "24GB" }, { value: "32", label: "32GB" }]} />
          </div>

          {/* Current Search Location */}
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Location:</span> {getCurrentLocation()}
          </div>
        </div>

      </div>
    </Card>
  );
}