"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import CtaButton from "@/components/ctaButton";
import Footer from "@/components/footer";
import LetterForm from "@/components/forms/letter";
import { IProfile } from "@/types/profile";
import { createClient } from "@/utils/supabase/client";
import { Badge, Check, UserCircle } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";
import { signInWithGoogle } from "@/actions/auth";
import Link from "next/link";

export default function SendPage() {
  const supabase = createClient();
  const router = useRouter();
  const { username } = useParams();
  const [isOpen, setIsOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [userCount, setUserCount] = React.useState<number>(0);
  const [user, setUser] = React.useState<IProfile>({} as IProfile);

  const getUser = async () => {
    const { data: user, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (!user) {
      router.push("/404");
      return;
    }

    return user;
  };

  const getUserCount = async () => {
    const { data, error } = await supabase.from("profiles").select("id");
    if (error) {
      console.error(error);
      return;
    }

    return data.length;
  };

  const increaseViewCount = async (viewed: number) => {
    const { data, error } = await supabase
      .from("profiles")
      .update({ viewed: viewed + 1 })
      .eq("username", username)
      .single();

    if (error) {
      console.error(error);
      return;
    }
    return data;
  };

  React.useEffect(() => {
    getUser().then((user) => {
      setUser(user);
      increaseViewCount(user.viewed);
      setIsLoading(false);
    });

    getUserCount().then((res) => {
      if (!res) return;
      setUserCount(res);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="flex items-center gap-3 animate-pulse mt-4">
          <div className="w-20 aspect-square bg-primary-foreground rounded-full" />
          <div className="flex flex-col gap-1">
            <div className="w-32 h-6 bg-primary-foreground rounded" />
            <div className="w-64 h-4 bg-primary-foreground rounded" />
          </div>
        </div>
        <div className="w-full h-40 bg-primary-foreground rounded-xl mt-8" />
        <div className="w-full h-72 bg-primary-foreground rounded-xl mt-4" />
        <div className="w-full h-72 bg-primary-foreground rounded-xl mt-4" />
        <div className="w-full h-72 bg-primary-foreground rounded-xl mt-4" />
      </div>
    );
  }

  return (
    <>
      <main>
        <div className="flex items-center gap-3 mb-8 mt-4">
          {user?.avatar_url ? (
            <Image
              src={user?.avatar_url.replace("s96-c", "s120-c")}
              alt={user?.display_name}
              width={80}
              height={80}
              className="rounded-full bg-primary-foreground"
            />
          ) : (
            // <UserCircle size={80} className="rounded-full" />
            <div className="w-20 aspect-square rounded-full bg-primary-foreground" />
          )}
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold">{user?.display_name}</h1>
              <div className="relative w-2 h-2 bg-green-400 rounded-full">
                <div className="absolute top-0 left-0 w-2 h-2 bg-green-400 rounded-full animate-ping" />
              </div>
            </div>
            <p className="text-sm text-neutral-500">
              Send me your sweetest message
            </p>
          </div>
        </div>
        <div>
          <LetterForm username={username as string} setIsOpen={setIsOpen} />
          <div className="mt-2">
            <Link href={`/auth`} target="_blank">
              <CtaButton className="w-full bg-neutral-200 hover:bg-neutral-300 text-black">
                Get my own love letters
              </CtaButton>
            </Link>
            <p className="text-center text-sm mt-2 text-neutral-500">
              Join {userCount} beloved people now
            </p>
          </div>
        </div>
      </main>
      <Dialog modal open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader hidden>
            <DialogTitle hidden />
          </DialogHeader>
          <div className="text-center p-4">
            <div className="flex my-4">
              <div className="relative m-auto">
                <Badge
                  size={150}
                  fill=""
                  className="relative fill-primary text-primary animate-spin animate-duration-[10000ms]"
                />
                <Check
                  size={80}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white m-auto"
                />
              </div>
            </div>
            <h2 className="text-2xl font-semibold">Love sent! </h2>
            <div className="flex flex-col gap-4 mt-10">
              <div className="mt-2">
                <Link href={`/auth`} target="_blank">
                  <CtaButton className="w-full">
                    Get my own love letters
                  </CtaButton>
                </Link>
                <p className="text-center text-sm mt-2 text-neutral-500">
                  Join {userCount} beloved people now
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </>
  );
}
