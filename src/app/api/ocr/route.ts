export const runtime = "nodejs"; // ✅ Required for tesseract.js to work

import { NextRequest, NextResponse } from "next/server";
import Tesseract from "tesseract.js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const imageBase64 = body.imageBase64;

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");

    const {
      data: { text },
    } = await Tesseract.recognize(buffer, "eng");

    return NextResponse.json({ text });
  } catch (error) {
    console.error("OCR Error:", error);
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}

