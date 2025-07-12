export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req: NextRequest) {
  console.log("✅ OCR API route hit");

  try {
    const body = await req.json();
    const imageBase64 = body.imageBase64;

    if (!imageBase64) {
      console.log("⚠️ No imageBase64 in body");
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    console.log("📦 Decoded image buffer size:", buffer.length);

    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng", {
      logger: (m) => console.log("🪵 OCR progress:", m),
    });

    console.log("✅ Extracted text:", text);
    return NextResponse.json({ text });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("❌ OCR Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

