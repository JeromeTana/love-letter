"use client";

import React from "react";
import { Button } from "./ui/button";
import { Link } from "lucide-react";

export default function CopyUrlButton({ url }: { url: string }) {
  const copyUrl = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Button onClick={copyUrl} size={"lg"}>
      <Link />
      Copy link
    </Button>
  );
}
