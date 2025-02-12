"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";

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
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { IProfile } from "@/types/profile";
import CtaButton from "../ctaButton";

const formSchema = z.object({
  username: z
    .string()
    .nonempty("Username is required")
    .regex(
      /^(?=.*[A-Za-z])[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/,
      "Username must contain at least one letter"
    ),
  display_name: z.string().nonempty("Display name is required"),
});

export default function ProfileForm() {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = React.useState<User>({} as User);
  const [profile, setProfile] = React.useState<IProfile>({} as IProfile);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      display_name: "",
    },
  });

  const getUser = async () => {
    const session = await supabase.auth.getUser();

    if (!session.data?.user) {
      return;
    }

    setUser(session.data.user);
    return session.data.user;
  };

  const getProfile = async (id: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    setProfile(profile);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const { error } = await supabase.from("profiles").upsert([
      {
        id: user.id,
        display_name: values.display_name,
        username: values.username,
        avatar_url: user.user_metadata.avatar_url,
      },
    ]);

    if (error) {
      error.code === "23505" &&
        form.setError("username", { message: "Username is already taken" });
      return;
    }

    router.push("/");
  };

  useEffect(() => {
    getUser().then((res) => {
      if (!res) return;
      getProfile(res?.id);
    });
  }, []);

  useEffect(() => {
    if (!profile) return;

    form.setValue("username", profile.username);
    form.setValue("display_name", profile.display_name);
  }, [profile]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <div className="flex items-center gap-1">
                  <p className="text-neutral-500 font-semibold">SENDLOVELETTER.LINK/</p>
                  <Input placeholder="jerometanaa" {...field} />
                </div>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Display name</FormLabel>
              <FormControl>
                <Input placeholder="Jerome Tana" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <CtaButton
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full"
        >
          Save
        </CtaButton>
      </form>
    </Form>
  );
}
