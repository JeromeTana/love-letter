import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import Image from "next/image";

export default async function Home() {
  const supabase = await createClient();

  const session = await supabase.auth.getUser();

  if (!session.data?.user) {
    return (
      <div>
        <h1>Home</h1>
        <p>Not logged in</p>
      </div>
    );
  }

  const {
    data: {
      user: { user_metadata },
    },
  } = session;

  return (
    <div>
      <h1>Home</h1>
      <Image
        src={user_metadata.avatar_url}
        alt="Vercel Logo"
        width={72}
        height={16}
      />
      <div>Current user: {user_metadata.full_name}</div>
      <Button variant={"destructive"} onClick={signOut}>
        Logout
      </Button>
    </div>
  );
}
