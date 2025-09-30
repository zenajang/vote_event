import { Suspense } from "react";
import MainClient from "./MainClient";
import { createServerAction } from "@/lib/supabase/server-action";

export default async function Page() {
  const supabase = await createServerAction();
  const { data: { user } } = await supabase.auth.getUser();

  return (
  <Suspense fallback={null} >
    <MainClient initialUser={user} />
  </Suspense>
)}
