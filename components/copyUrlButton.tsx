"use client";

import React from "react";
import { Link } from "lucide-react";
import CtaButton from "./ctaButton";
import { useToast } from "@/hooks/use-toast";

export default function CopyUrlButton({ url }: { url: string }) {
  const { toast } = useToast();
  const copyUrl = () => {
    return navigator.clipboard.writeText(url);
  };

  const showToast = () => {
    toast({
      title: "Link copied!",
      description: "You can now share the link in your stories",
      duration: 3000,
    });
  };

  const handleCopyUrl = () => {
    copyUrl().then(() => {
      showToast();
    });
  };
  return (
    <CtaButton className="w-full" onClick={handleCopyUrl}>
      <Link />
      Copy link
    </CtaButton>
  );
}
