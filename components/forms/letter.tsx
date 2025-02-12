"use client";

import React, { useEffect, useMemo } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";

import { createClient } from "@/utils/supabase/client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IProfile } from "@/types/profile";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import CtaButton from "../ctaButton";
import GiftItem from "../giftItem";
import {
  Calendar,
  Ellipsis,
  Gift,
  Heart,
  PlusCircle,
  User,
} from "lucide-react";
import { MdiSpotify } from "../icons/spotify";
import { cn } from "@/lib/utils";

const getSpotifySongId = (url: string) => {
  const regex = /track\/([a-zA-Z0-9]+)\??/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }
  return null;
};

const formSchema = z.object({
  sender: z.string(),
  revealed_at: z.date().optional(),
  message: z.string().nonempty("Come on, don't be shy! Write something"),
  spotify_id: z.string(),
});

export default function LetterForm({
  username,
  setIsOpen,
}: {
  username: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const supabase = createClient();
  const [profile, setProfile] = React.useState<IProfile>({} as IProfile);
  const [selectedGift, setSelectedGift] = React.useState<number>(1);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sender: "",
      message: "",
      spotify_id: "",
    },
  });

  const spotifyExtractedId = useMemo(
    () => getSpotifySongId(form.getValues().spotify_id),
    [form.getValues().spotify_id]
  );

  const getProfileFromUsername = async (username: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setProfile(profile);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from("letters").upsert([
      {
        send_to: profile.id,
        sender: values.sender,
        revealed_at: values.revealed_at,
        message: values.message,
        spotify_id: spotifyExtractedId,
        gift_id: selectedGift,
      },
    ]);

    if (error) {
      console.error(error);
      return;
    }

    setIsOpen(true);
    form.reset();
  };

  useEffect(() => {
    getProfileFromUsername(username);
  }, []);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4 rounded-xl p-4 bg-primary-foreground">
            <h2 className="font-semibold flex items-center gap-1">
              <Gift /> Choose a gift
            </h2>
            <div className="grid grid-cols-5 gap-2 bg-primary-foreground rounded-xl">
              {[1, 2, 3, 4, 5].map((gift) => (
                <div
                  key={gift}
                  className={cn(
                    selectedGift === gift
                      ? "border-primary"
                      : "border-slate-200",
                    `p-3 aspect-square flex items-center justify-center border-2 bg-white rounded-full cursor-pointer duration-200`
                  )}
                  onClick={() => setSelectedGift(gift)}
                >
                  <GiftItem giftId={gift} width={50} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4 rounded-xl p-4 bg-primary-foreground">
            <h2 className="font-semibold">What's in your heart</h2>
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      rows={8}
                      {...field}
                      placeholder="Shoot your shot! Write it all down"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4 rounded-xl p-4 bg-primary-foreground">
            <h2 className="font-semibold">
              Who's sending this{" "}
              <span className="text-sm text-neutral-400 font-normal">
                (Optional)
              </span>
            </h2>
            <FormField
              control={form.control}
              name="sender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <User size={16} />
                    Your name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Default set as "Anonymous"'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="revealed_at"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <Calendar size={16} />
                    Revealed at
                  </FormLabel>
                  <FormControl>
                    <DatePicker
                    
                      placeholder={"Default set as now"}
                      field={field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-4 rounded-xl p-4 bg-primary-foreground">
            <h2 className="font-semibold">
              Add a Lovely Song{" "}
              <span className="text-sm text-neutral-400 font-normal">
                (Optional)
              </span>
            </h2>
            <FormField
              control={form.control}
              name="spotify_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-1">
                    <MdiSpotify
                      style={{
                        fontSize: "1.2rem",
                      }}
                    />
                    Spotify song Url
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://open.spotify.com/track/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {spotifyExtractedId ? (
              <iframe
                src={`https://open.spotify.com/embed/track/${spotifyExtractedId}?utm_source=generator&theme=0`}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                className="w-full h-20 rounded-xl"
              />
            ) : (
              <SpotifyEmbedSkeleton />
            )}
          </div>

          <div className="relative group text-primary z-10">
            <CtaButton
              disabled={form.formState.isSubmitting}
              type="submit"
              className="relative w-full"
            >
              Send the love
            </CtaButton>
            <Heart
              size={20}
              className="absolute top-2 -right-2 rotate-[15deg] fill-white duration-200 group-active:top-1 group-active:right-0"
            />
            <Heart
              size={16}
              className="absolute -bottom-2 right-4 rotate-[20deg] fill-white duration-200 group-active:bottom-0 group-active:right-3"
            />
            <Heart
              size={16}
              className="absolute bottom-2 -left-2 -rotate-12 fill-white duration-200 group-active:bottom-4 group-active:left-0"
            />
            <Heart
              size={28}
              className="absolute -bottom-3 left-4 -rotate-12 fill-white duration-200 group-active:-bottom-1 group-active:left-4"
            />
          </div>
        </form>
      </Form>
    </>
  );
}

function SpotifyEmbedSkeleton() {
  return (
    <div className="w-full flex justify-between  p-2 rounded-xl bg-neutral-200">
      <div className="flex gap-4">
        <div className="w-16 aspect-square rounded-lg bg-neutral-300" />
        <div className="flex flex-col gap-1.5 mt-2">
          <div className="w-32 h-4 bg-neutral-300 rounded" />
          <div className="w-14 h-3 bg-neutral-300 rounded" />
          <div className="w-20 h-3 bg-neutral-300 rounded" />
        </div>
      </div>
      <div className="flex flex-col items-end justify-between text-neutral-300">
        <MdiSpotify style={{ fontSize: "1.2rem" }} />
        <div className="flex gap-4 items-end">
          <PlusCircle />
          <Ellipsis />
          <div className="w-8 aspect-square rounded-full bg-neutral-300" />
        </div>
      </div>
    </div>
  );
}
