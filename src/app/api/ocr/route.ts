export const runtime = "nodejs"; // ✅ Vercel needs this to use tesseract.js

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

    console.log("Extracted text:", text); // ✅ Log on the server

    return NextResponse.json({ text });
  } catch (error) {
    console.error("OCR Error:", error); // ✅ Will appear in Vercel Function Logs
    return NextResponse.json({ error: "OCR failed" }, { status: 500 });
  }
}

