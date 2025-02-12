// "use server"

// import { createClient } from "@/utils/supabase/server";

// const createProfile = async (user: any) => {
//   const supabase = createClient();
//   const { error } = await supabase.from("profiles").insert([
//     {
//       id: user.id,
//       display_name: user.user_metadata.full_name,
//       username: user.email,
//       avatar_url: user.user_metadata.avatar_url,
//     },
//   ]);

//   if (error) {
//     console.error(error);
//     return;
//   }
// };

// export { createProfile };
