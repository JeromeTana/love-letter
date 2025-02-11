"use server";

import { createClient } from "@/utils/supabase/server";
import { Provider } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

const signInWith = (provider: Provider) => async () => {
  const supabase = createClient();

  const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: auth_callback_url,
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
