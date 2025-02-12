import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

export default function CtaButton({ children, className, ...props }: any) {
  return (
    <Button
      className={cn(
        className,
        "rounded-xl text-lg font-semibold h-12 px-12 py-6"
      )}
      {...props}
    >
      {children}
    </Button>
  );
}
