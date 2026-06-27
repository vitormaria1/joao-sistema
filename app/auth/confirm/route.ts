import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return NextResponse.redirect(
    new URL("/login?error=Fluxo%20de%20confirmacao%20foi%20desativado", request.url),
  );
}
