import { signInWithGoogle } from "@/actions/auth";
import CtaButton from "@/components/ctaButton";
import Footer from "@/components/footer";
import OneTapComponent from "@/components/oneTapGoogleOauth";
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
      <OneTapComponent />
      <CtaButton onClick={signInWithGoogle}>
        <Key />
        Continue with google
      </CtaButton>
      <Footer className="fixed bottom-0 left-0 mb-4" />
    </div>
  );
}
