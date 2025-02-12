import { signOut } from "@/actions/auth";
import CopyUrlButton from "@/components/copyUrlButton";
import LetterItem from "@/components/letterItem";
import { Button } from "@/components/ui/button";
import { ILetter } from "@/types/letter";
import { createClient } from "@/utils/supabase/server";
import { Link, Mail } from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();

  // Check if the user is authenticated
  const session = await supabase.auth.getUser();
  if (!session.data?.user) {
    return redirect("/auth");
  }

  // Check if the user has a profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.data.user.id)
    .single();

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

  return (
    <main className="w-full">
      <p>viewed: {profile.viewed}</p>
      <Image
        src={profile.avatar_url}
        alt="User profile picture"
        width={72}
        height={16}
        className="rounded-full"
      />
      <div>Current user: {profile.display_name}</div>
      <p className="flex items-center gap-2">
        <Mail /> {letters.length}
      </p>
      <p>sendloveletter.link {profile.username}</p>
      <CopyUrlButton url={`https://sendloveletter.link/${profile.username}`} />
      <Button variant={"outline"} onClick={signOut}>
        Logout
      </Button>
      <div className="flex flex-col gap-2">
        {letters.map((letter: ILetter) => (
          <LetterItem key={letter.id} letter={letter} />
        ))}
      </div>
    </main>
  );
}
