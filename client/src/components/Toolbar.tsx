import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { courseCategories } from "@/lib/utils";

interface ToolbarProps {
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

export default function Toolbar({ onSearch, onCategoryChange }: ToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-6 w-full">
      {/* Search Input */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-customgreys-dirtyGrey" />
        <Input
          type="text"
          placeholder="Search courses..."
          className="pl-10 w-full border-none bg-customgreys-secondarybg text-white-100 placeholder:text-customgreys-dirtyGrey focus-visible:ring-1 focus-visible:ring-primary-700"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      {/* Category Select */}
      <div className="w-full sm:w-[200px]">
        <Select defaultValue="all" onValueChange={(value) => onCategoryChange(value || "all")}>
          <SelectTrigger className="w-full border-none bg-customgreys-secondarybg text-white-100 focus:ring-1 focus:ring-primary-700">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-customgreys-primarybg border-customgreys-secondarybg text-white-100">
            <SelectItem value="all" className="cursor-pointer focus:bg-customgreys-secondarybg focus:text-white-100">
              All Categories
            </SelectItem>
            {courseCategories.map((category) => (
              <SelectItem
                key={category.value}
                value={category.value}
                className="cursor-pointer focus:bg-customgreys-secondarybg focus:text-white-100"
              >
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
