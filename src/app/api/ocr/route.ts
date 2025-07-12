export const runtime = "nodejs"; // Make sure Vercel uses the Node.js runtime

import { NextResponse } from "next/server";

export async function POST() {
  console.log("✅ Reached OCR route test");

  return NextResponse.json({
    text: "This is a hardcoded test response from the OCR route.",
  });
}

