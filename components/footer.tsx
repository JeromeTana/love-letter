import { cn } from "@/lib/utils";
import { Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Footer({
  className,
}: Readonly<{ className?: string }>) {
  return (
    <footer>
      <Link
        href="https://instagram.com/jerometanaa"
        className={cn(
          "inline-flex items-center justify-center gap-2 m-auto w-full text-center p-2 mt-20",
          className
        )}
      >
        <Instagram />
        <p className="inline-flex items-center gap-2">
          By{" "}
          <span className="inline-flex items-center gap-1 font-semibold">
            <Image
              src="/images/jerome_pfp.png"
              alt="Jerome Tana"
              width={24}
              height={24}
              className="rounded-full
          "
            />
            Jerome Tana
          </span>
        </p>
      </Link>
    </footer>
  );
}
