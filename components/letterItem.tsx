"use client";

import { ILetter } from "@/types/letter";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { TZDate } from "@date-fns/tz";
import DialogComponent from "@/components/dialogComponent";
import { Clock, Gift } from "lucide-react";
import GiftItem from "@/components/giftItem";

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;

function formatDateTimeZone(date: string) {
  return new TZDate(date, TIMEZONE);
}

function countDown(date: string) {
  const now = new Date();
  const future = new Date(date);
  const diff = future.getTime() - now.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} years`;
  if (months % 12 > 0) return `${months % 12} months`;
  if (days % 30 > 0) return `${days % 30} days`;
  if (hours % 24 > 0) return `${hours % 24} hours`;
  if (minutes % 60 > 0) return `${minutes % 60} minutes`;
}

function dateTimeDistance(date: string) {
  const now = new Date();
  const past = new Date(date);
  const diff = now.getTime() - past.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} years ago`;
  if (months > 0) return `${months} months ago`;
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return `Now`;
}

export default function LetterItem({ letter }: { letter: ILetter }) {
  const supabase = createClient();
  const [isOpened, setIsOpened] = React.useState(letter.is_opened);

  const onOpenLetter = async (letter_id: string) => {
    const { error } = await supabase
      .from("letters")
      .update({ is_opened: true })
      .eq("id", letter_id);

    if (error) {
      console.error(error);
      return;
    }
    setIsOpened(true);
  };

  return (
    <div key={letter.id} className="cursor-pointer">
      <DialogComponent
        header={<div className="flex items-center"></div>}
        triggerButton={
          <div>
            {isOpened ? (
              <div
                key={letter.id}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary-foreground"
              >
                <div className="p-3 border border-neutral-300 bg-neutral-50 rounded-full">
                  <GiftItem width={30} giftId={letter.gift_id} />
                </div>
                <div>
                  <Sender
                    sender={letter.sender}
                    revealed_at={letter.revealed_at}
                  />
                  <RevealCountdown
                    sender={letter.sender}
                    revealed_at={letter.revealed_at}
                    created_at={letter.created_at}
                  />
                </div>
              </div>
            ) : (
              <NewMessage
                letter_id={letter.id}
                created_at={letter.created_at}
                onOpenLetter={onOpenLetter}
              />
            )}
          </div>
        }
      >
        <LetterTemplate letter={letter} />
      </DialogComponent>
    </div>
  );
}

function LetterTemplate({ letter }: { letter: ILetter }) {
  return (
    <div className="flex flex-col gap-2 p-2">
      <div key={letter.id} className="flex items-center gap-3 p-2 rounded-xl">
        <div className="p-3 border border-neutral-300 bg-neutral-50 rounded-full">
          <GiftItem width={50} giftId={letter.gift_id} />
        </div>
        <div>
          <Sender sender={letter.sender} revealed_at={letter.revealed_at} />
          <RevealCountdown
            sender={letter.sender}
            revealed_at={letter.revealed_at}
            created_at={letter.created_at}
          />
        </div>
      </div>
      <p className="p-3 h-80 bg-primary-foreground rounded-xl overflow-y-scroll">
        {letter.message}
      </p>
      {letter.spotify_id && (
        <iframe
          src={`https://open.spotify.com/embed/track/${letter.spotify_id}?utm_source=generator&theme=0`}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="w-full h-20 rounded-xl bg-primary-foreground"
        />
      )}
    </div>
  );
}

function NewMessage({
  letter_id,
  created_at,
  onOpenLetter,
}: {
  letter_id: string;
  created_at: string;
  onOpenLetter: any;
}) {
  return (
    <div
      key={letter_id}
      className="flex gap-3 items-center bg-primary-foreground border-[1.5px] border-primary p-4 rounded-xl"
      onClick={() => onOpenLetter(letter_id)}
    >
      <div className="p-2 border border-neutral-400 bg-neutral-50 rounded-full">
        <Gift size={28} className="text-primary" />
      </div>
      <div>
        <p className="font-semibold">New message</p>
        <p className="text-sm text-neutral-500">
          {dateTimeDistance(formatDateTimeZone(created_at).toISOString())}
        </p>
      </div>
    </div>
  );
}

function Sender({
  sender,
  revealed_at,
}: {
  sender?: string;
  revealed_at: string;
}) {
  return (
    <div className="font-semibold">
      {sender ? (
        new TZDate(revealed_at) > new Date() ? (
          <div className="relative">
            <p>Anonymous</p>
            <div className="w-full h-full bg-transparent absolute top-0 left-0 rounded backdrop-blur-sm" />
          </div>
        ) : (
          <p>{sender}</p>
        )
      ) : (
        <p>Anonymous</p>
      )}
    </div>
  );
}

function RevealCountdown({
  sender,
  revealed_at,
  created_at,
}: {
  sender: string;
  revealed_at: string;
  created_at: string;
}) {
  return (
    <div className="text-sm">
      {sender && new TZDate(revealed_at) > new Date() ? (
        <p className="inline-flex items-center gap-1 text-primary">
          <Clock size={14} />
          Reveal in {countDown(formatDateTimeZone(revealed_at).toISOString())}
        </p>
      ) : (
        <p className="text-neutral-500">
          {dateTimeDistance(formatDateTimeZone(created_at).toISOString())}
        </p>
      )}
    </div>
  );
}
