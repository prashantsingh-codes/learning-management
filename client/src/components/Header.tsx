import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export default function Header({ title, subtitle, rightElement }: HeaderProps) {
  return (
    <div className="flex items-center justify-between mb-7">
      <div className="space-y-1.5">
        <h1 className="text-3xl font-bold tracking-tight text-white-100">{title}</h1>
        {subtitle && (
          <p className="text-sm text-customgreys-dirtyGrey font-medium">{subtitle}</p>
        )}
      </div>
      {rightElement && <div>{rightElement}</div>}
    </div>
  );
}
