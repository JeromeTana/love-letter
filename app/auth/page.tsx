import { signInWithGoogle } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import React from "react";

export default function AuthPage() {
  return (
    <div>
      <Button onClick={signInWithGoogle}>Continue with google</Button>
    </div>
  );
}
