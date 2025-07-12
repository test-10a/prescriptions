/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";          // use full Node runtime

import { NextRequest, NextResponse } from "next/server";
import { createWorker, type WorkerParams } from "tesseract.js";

/* ---------- worker setup ------------------------------------------------ */
type WorkerOpts = Partial<WorkerParams> & {
  corePath: string;
  logger: (m: unknown) => void;
};

const workerPromise = (async () => {
  const opts: WorkerOpts = {
    corePath: "/tesseract-core-simd.wasm",   // WASM served from /public
    logger: m => console.log("🪵", m),
  };

  const worker: any = await createWorker(opts as any); // cast—types are old
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  return worker;
})();
/* ------------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  console.log("✅ OCR route hit");

  try {
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const worker: any = await workerPromise;        // reuse when warm
    const { data } = await worker.recognize(buffer);

    console.log("✅ Extracted text:", data.text.trim().slice(0, 60));
    return NextResponse.json({ text: data.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

