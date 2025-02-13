"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClient();

  const auth_callback_url = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });
  
  if (error) {
    console.error("Error signing in with Google:", error.message);
    return;
  }

  redirect(data.url);
};

const signInWithGoogle = signInWith("google");

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};

export { signInWithGoogle, signOut };
