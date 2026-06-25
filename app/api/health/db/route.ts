import { NextResponse } from "next/server";
import { getDatabaseHealth } from "@/lib/db";

export async function GET() {
  try {
    const health = await getDatabaseHealth();

    return NextResponse.json({
      ok: true,
      health,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown database error";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}
