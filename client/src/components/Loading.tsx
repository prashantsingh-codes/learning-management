import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] w-full h-full space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary-700" />
      <span className="text-sm text-customgreys-dirtyGrey font-medium animate-pulse">Loading content...</span>
    </div>
  );
}
