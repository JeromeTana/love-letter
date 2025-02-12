"use client";

import { ILetter } from "@/types/letter";
import { createClient } from "@/utils/supabase/client";
import React from "react";
import { TZDate } from "@date-fns/tz";
import DialogComponent from "@/components/dialogComponent";

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

  const parts = [];
  if (years > 0) parts.push(`${years} years`);
  if (months % 12 > 0) parts.push(`${months % 12} months`);
  if (days % 30 > 0) parts.push(`${days % 30} days`);
  if (hours % 24 > 0) parts.push(`${hours % 24} hours`);
  if (minutes % 60 > 0) parts.push(`${minutes % 60} minutes`);
  return parts.join(", ");
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
  return `${seconds} seconds ago`;
}

export default function LetterItem({ letter }: { letter: ILetter }) {
  const supabase = createClient();
  const [isOpened, setIsOpened] = React.useState(letter.is_opened);

  const onOpenLetter = async (letter: ILetter) => {
    const { error } = await supabase
      .from("letters")
      .update({ is_opened: true })
      .eq("id", letter.id);

    if (error) {
      console.error(error);
      return;
    }
    setIsOpened(true);
  };

  return (
    <div key={letter.id} className="cursor-pointer">
      <DialogComponent
        header={<div className="flex items-center gap-2"></div>}
        triggerButton={
          isOpened ? (
            <div key={letter.id} className="border p-4 rounded-xl">
              {letter.sender ? (
                new TZDate(letter.revealed_at) > new Date() ? (
                  <div>----</div>
                ) : (
                  <div>{letter.sender}</div>
                )
              ) : (
                <div>Anonymous</div>
              )}
              {new TZDate(letter.revealed_at) > new Date() ? (
                <div>
                  Reveal in{" "}
                  {countDown(
                    formatDateTimeZone(letter.revealed_at).toISOString()
                  )}
                </div>
              ) : (
                <div>
                  {dateTimeDistance(
                    formatDateTimeZone(letter.created_at).toISOString()
                  )}
                </div>
              )}
            </div>
          ) : (
            <div
              key={letter.id}
              className="border border-primary p-4 rounded-xl"
              onClick={() => onOpenLetter(letter)}
            >
              <div>New message</div>
              <div>
                {dateTimeDistance(
                  formatDateTimeZone(letter.created_at).toISOString()
                )}
              </div>
            </div>
          )
        }
      >
        <div>
          <p>{letter.message}</p>
          {letter.spotify_id && (
            <iframe
              src={`https://open.spotify.com/embed/track/${letter.spotify_id}?utm_source=generator&theme=0`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full h-20 rounded-xl"
            />
          )}
        </div>
      </DialogComponent>
    </div>
  );
}
