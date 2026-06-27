import { redirect } from "next/navigation";
import { getAuthenticatedProfile } from "@/lib/auth";

export default async function Home() {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    redirect("/login");
  }

  redirect(profile.role === "student" ? "/portal" : "/dashboard");
}
