export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("✅ Reached OCR route test");

  return NextResponse.json({
    text: "This is a hardcoded test response from the OCR route.",
  });
}

