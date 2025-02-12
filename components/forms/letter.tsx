"use client";

import React, { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import { createClient } from "@/utils/supabase/client";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IProfile } from "@/types/profile";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";

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
  message: z.string().nonempty("Message is required"),
  spotify_id: z.string(),
});

export default function LetterForm({ username }: { username: string }) {
  const supabase = createClient();
  const [isOpen, setIsOpen] = React.useState(false);
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
          <div className="grid grid-cols-5 gap-2">
            {[1, 2, 3, 4, 5].map((gift) => (
              <div
                key={gift}
                className={`p-4 aspect-square border  rounded-full cursor-pointer ${
                  selectedGift === gift ? "border-blue-500" : "border-slate-200"
                }`}
                onClick={() => setSelectedGift(gift)}
              >
                <div className="text-center">{gift}</div>
              </div>
            ))}
          </div>
          <FormField
            control={form.control}
            name="sender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sender</FormLabel>
                <FormControl>
                  <Input placeholder='Default set as "Anonymous"' {...field} />
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
                <FormLabel>Revealed at</FormLabel>
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
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message</FormLabel>
                <FormControl>
                  <Textarea rows={8} {...field} className="resize-none" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spotify_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Spotify URL</FormLabel>
                <FormControl>
                  <Input placeholder="Optional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {spotifyExtractedId && (
            <iframe
              src={`https://open.spotify.com/embed/track/${spotifyExtractedId}?utm_source=generator&theme=0`}
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              className="w-full h-20 rounded-xl"
            />
          )}
          <Button disabled={form.formState.isSubmitting} type="submit">
            Send the love
          </Button>
        </form>
      </Form>

      <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader hidden>
            <DialogTitle hidden />
          </DialogHeader>
          <div className="text-center">
            <h2 className="text-2xl font-bold">
              Your love letter has been sent!
            </h2>
            <p className="text-lg text-neutral-500">
              You can view your love letter in your profile
            </p>
            <Button onClick={() => setIsOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
