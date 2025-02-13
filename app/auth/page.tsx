import { signInWithGoogle } from "@/actions/auth";
import CtaButton from "@/components/ctaButton";
import Footer from "@/components/footer";
import { createClient } from "@/utils/supabase/server";
import { Heart, Key } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthPage() {
  const supabase = await createClient();

  // Check if the user is authenticated
  const session = await supabase.auth.getUser();
  if (session.data?.user) {
    return redirect("/");
  }

  return (
    <div className="relative flex flex-col items-center justify-center h-screen space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Heart />
        <h1 className="text-4xl">
          Love<span className="font-semibold">Letter</span>
        </h1>
      </div>
      <CtaButton onClick={signInWithGoogle}>
        <Key />
        Continue with google
      </CtaButton>
      <Footer className="fixed bottom-0 left-0 mb-4" />
    </div>
  );
}
