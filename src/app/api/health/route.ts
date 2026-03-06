import { createSuccessPayload } from "@/lib/bffResponse";
import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json(createSuccessPayload({ ok: true }));
}
