import { signInWithGoogle } from "@/actions/auth";
import CtaButton from "@/components/ctaButton";
import Footer from "@/components/footer";
import { BiGoogle } from "@/components/icons/google";
import { Heart, Key } from "lucide-react";
import React from "react";

export default function AuthPage() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen space-y-6">
      <div className="flex items-center justify-center space-x-2">
        <Heart />
        <h1 className="text-4xl">
          Love<span className="font-semibold">Letter</span>
        </h1>
      </div>
      <CtaButton onClick={signInWithGoogle}>
        <BiGoogle />
        <p className="ml-2">Continue with Google</p>
      </CtaButton>
      <Footer className="fixed bottom-0 left-0 mb-4" />
    </div>
  );
}
