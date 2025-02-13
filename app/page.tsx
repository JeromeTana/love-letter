import { signOut } from "@/actions/auth";
import CopyUrlButton from "@/components/copyUrlButton";
import LetterItem from "@/components/letterItem";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ILetter } from "@/types/letter";
import { IProfile } from "@/types/profile";
import { createClient } from "@/utils/supabase/server";
import { TZDate } from "@date-fns/tz";
import { Cog, Eye, Heart, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  // Check if the user is authenticated
  const session = await supabase.auth.getUser();
  if (!session.data?.user) {
    return redirect("/auth");
  }

  // Check if the user has a profile
  const { data: profile } = (await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.data.user.id)
    .single()) as { data: IProfile };

  // Redirect to the profile creation page if the user doesn't have a profile
  if (!profile) return redirect("/profile/create");

  // Fetch the letters sent to the user
  const { data: letters, error } = await supabase
    .from("letters")
    .select("*")
    .order("created_at", { ascending: false })
    .filter("send_to", "eq", session.data.user.id);

  if (error) {
    console.error(error);
    return redirect("/auth");
  }

  const recentlyRevealed = letters.filter(
    (letter: ILetter) =>
      letter.revealed_at &&
      new TZDate().getTime() > new TZDate(letter.revealed_at).getTime() &&
      new TZDate().getTime() - new TZDate(letter.revealed_at).getTime() <
        86400000
  );

  return (
    <main className="w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full text-sm bg-primary-foreground">
          <Eye size={16} />
          <span className="font-semibold">{profile.viewed}</span> Views
        </div>
        <Popover>
          <PopoverTrigger>
            <div className="cursor-pointer p-2 rounded-full bg-primary-foreground">
              <Cog size={16} />
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-col gap-2">
              <Link href="/profile/edit">
                <Button variant={"ghost"} className="w-full justify-start">
                  <p className="font-semibold">Edit profile</p>
                </Button>
              </Link>
              <Button
                variant={"ghost"}
                className="w-full justify-start"
                onClick={signOut}
              >
                <p className="text-red-500 font-semibold">Logout</p>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div className="text-center">
        <div className="flex flex-col items-center gap-3">
          <Image
            src={profile.avatar_url}
            alt="User profile picture"
            width={140}
            height={140}
            className="rounded-full m-auto"
          />
          <h1 className="text-2xl font-semibold">{profile.display_name}</h1>
          <p className="relative flex justify-center items-center gap-2">
            <Mail /> {letters.length}
            <Heart
              size={8}
              fill=""
              className="absolute bottom-0 -left-3 -rotate-12 fill-primary text-primary"
            />
            <Heart
              size={6}
              fill=""
              className="absolute top-1.5 -left-2 -rotate-12 fill-primary text-primary"
            />
            <Heart
              size={8}
              fill=""
              className="absolute top-0 -right-2.5 rotate-12 fill-primary text-primary"
            />
          </p>
        </div>
        <div className="flex flex-col gap-4 bg-primary-foreground text-primary-background rounded-xl p-4 mt-8">
          <p className="font-semibold">Copy your link and share on story</p>
          <p className="text-neutral-500 font-medium text-sm">
            SENDLOVELETTER.LINK/{profile.username.toUpperCase()}
          </p>
          <CopyUrlButton
            url={`https://sendloveletter.link/${profile.username}`}
          />
        </div>
      </div>
      <div className="mt-12 space-y-8">
        {recentlyRevealed.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="inline-flex items-center gap-1 text-neutral-500 font-medium text-xs">
              <Mail size={12} />
              RECENTLY REVEALED
            </p>
            <div className="flex flex-col gap-2">
              {recentlyRevealed.map((letter: ILetter) => (
                <LetterItem key={letter.id} letter={letter} />
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col gap-3">
          <p className="inline-flex items-center gap-1 text-neutral-500 font-medium text-xs">
            <Mail size={12} />
            INBOX
          </p>
          <div className="flex flex-col gap-2">
            {letters.map((letter: ILetter) => (
              <LetterItem key={letter.id} letter={letter} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
