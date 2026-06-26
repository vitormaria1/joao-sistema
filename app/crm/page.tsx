import { redirect } from "next/navigation";

const FALLBACK_TWENTY_URL = "http://187.127.33.19:3001";

function getCrmUrl() {
  return process.env.NEXT_PUBLIC_TWENTY_URL ?? FALLBACK_TWENTY_URL;
}

export default function CrmPage() {
  redirect(getCrmUrl());
}
