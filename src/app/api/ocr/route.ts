export const runtime = "nodejs";             // run in full Node runtime

import { NextRequest, NextResponse } from "next/server";
import { createWorker, type WorkerParams } from "tesseract.js";

/** -------- Worker set‑up (typed) -------------------------------- */
type WorkerOpts = Partial<WorkerParams> & {
  corePath: string;               // extra keys we really use
  logger: (m: unknown) => void;
};

const workerPromise = (async () => {
  const opts: WorkerOpts = {
    corePath: "/tesseract-core-simd.wasm",   // ← WASM lives in /public
    logger: m => console.log("🪵", m),
  };

  // cast to any so outdated d.ts doesn’t complain
  const worker = await createWorker(opts as any);

  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  return worker;
})();
/** --------------------------------------------------------------- */

export async function POST(req: NextRequest) {
  console.log("✅ OCR route hit");

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const worker = await workerPromise;              // reuse across warm calls
    const { data } = await worker.recognize(buffer);

    console.log("✅ Extracted text:", data.text.trim().slice(0, 60));
    return NextResponse.json({ text: data.text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

