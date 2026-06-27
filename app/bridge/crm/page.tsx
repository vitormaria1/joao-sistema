import { redirect } from "next/navigation";
import { requireAdminSession } from "@/lib/auth";
import {
  buildTwentyHandoffUrl,
  getTwentyTokenPairForUser,
} from "@/lib/twenty-bridge";

export default async function CrmBridgePage() {
  const { user } = await requireAdminSession("/crm");

  const tokenPair = await getTwentyTokenPairForUser(user);
  redirect(buildTwentyHandoffUrl(tokenPair));
}
