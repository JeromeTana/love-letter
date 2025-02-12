// "use server";

// import { createClient } from "@/utils/supabase/server";

// export default async function sendLetter() {
//   const supabase = createClient();

//   const { data, error } = await supabase.from("letters").insert([
//     {
//       send_to: "user_id",
//       message: "message",
//     },
//   ]);

//   if (error) {
//     console.error(error);
//     return;
//   }
// }