import { ELetterGift } from "@/types/letter";
import Image from "next/image";
import React from "react";

export default function GiftItem({
  giftId,
  width = 30,
  height = width,
}: {
  giftId: number;
  width: number;
  height?: number;
}) {
  switch (giftId) {
    case ELetterGift.FLOWERS:
      return (
        <Image
          src="/images/red-rose.png"
          alt="flower"
          width={width}
          height={height}
        />
      );
    case ELetterGift.CHOCOLATE:
      return (
        <Image
          src="/images/chocolate.png"
          alt="chocolate"
          width={width}
          height={height}
        />
      );
    case ELetterGift.DOLL:
      return (
        <Image
          src="/images/teddy-bear.png"
          alt="teddy"
          width={width}
          height={height}
        />
      );
    case ELetterGift.CAKE:
      return (
        <Image
          src="/images/chocolate-cake.png"
          alt="cake"
          width={width}
          height={height}
        />
      );
    case ELetterGift.WINE:
      return (
        <Image
          src="/images/wine.png"
          alt="wine"
          width={width}
          height={height}
        />
      );
    default:
      return <div>Unknown</div>;
  }
}
