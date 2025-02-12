import ProfileForm from "@/components/forms/profile";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function CreateProfile() {
  const supabase = createClient();

  const checkProfile = async () => {
    const session = await supabase.auth.getUser();
    if (!session.data?.user) {
      return;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.data.user.id)
      .maybeSingle();

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      return redirect("/profile/edit");
    }
  };

  await checkProfile();

  return (
    <main>
      <h1 className="font-semibold text-xl mb-10">Create profile</h1>
      <ProfileForm />
    </main>
  );
}
