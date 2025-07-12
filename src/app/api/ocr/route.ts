export const runtime = "nodejs"; // Full Node runtime, not Edge

import { NextRequest, NextResponse } from "next/server";
import { createWorker } from "tesseract.js";

const workerPromise = (async () => {
  const worker = await createWorker({
    // Tell Tesseract where the wasm lives:
    corePath: "/tesseract-core-simd.wasm",
    // Optional logger to watch progress in Vercel logs:
    logger: m => console.log("🪵", m),
  });
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  return worker;
})();

export async function POST(req: NextRequest) {
  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const worker = await workerPromise;            // reuse between invocations
    const { data } = await worker.recognize(buffer);

    return NextResponse.json({ text: data.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

