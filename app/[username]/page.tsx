"use client";

import LetterForm from "@/components/forms/letter";
import { IProfile } from "@/types/profile";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function SendPage() {
  const supabase = createClient();
  const router = useRouter();
  const { username } = useParams();
  const [isLoading, setIsLoading] = React.useState(true);
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
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main>
      <div>
        {user?.avatar_url ? (
          <Image
            src={user?.avatar_url}
            alt={user?.display_name}
            width={100}
            height={100}
          />
        ) : (
          <div>(handle no avatar)</div>
        )}

        {user?.display_name}
      </div>
      <div>
        <LetterForm username={username as string} />
      </div>
    </main>
  );
}
