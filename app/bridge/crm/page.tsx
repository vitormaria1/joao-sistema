import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/auth";
import {
  buildTwentyHandoffUrl,
  getTwentyTokenPairForUser,
} from "@/lib/twenty-bridge";

export default async function CrmBridgePage() {
  const user = await getAuthenticatedUser();

  if (!user) {
    redirect("/login?next=/crm");
  }

  const tokenPair = await getTwentyTokenPairForUser(user);
  redirect(buildTwentyHandoffUrl(tokenPair));
}
