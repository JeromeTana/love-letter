"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import React from "react";

export default function Collapsible({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div
      className={cn(
        isOpen ? "h-auto" : "h-72",
        "relative border border-primary rounded-2xl p-3 bg-primary/20 overflow-clip"
      )}
    >
      {isOpen ? (
        ""
      ) : (
        <div
          onClick={() => {
            setIsOpen(true);
          }}
          className="absolute bottom-0 left-0 flex items-end justify-center w-full h-20 p-4 bg-gradient-to-t from-black/50 cursor-pointer"
        >
          <div className="flex items-center gap-2 text-white font-semibold">
            <ChevronDown size={16} />
            <p>View all</p>
          </div>
        </div>
      )}

      {children}
    </div>
  );
}
