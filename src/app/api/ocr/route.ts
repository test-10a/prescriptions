export const runtime = "nodejs"; // use full Node runtime

import { NextRequest, NextResponse } from "next/server";
import { createWorker, type WorkerParams } from "tesseract.js";

// ---- Typed worker options ---------------------------------
type WorkerOpts = WorkerParams & {
  corePath: string;   // not in upstream d.ts – we add it
  logger: (m: unknown) => void;
};

const workerPromise = (async () => {
  const opts: WorkerOpts = {
    corePath: "/tesseract-core-simd.wasm",
    logger: m => console.log("🪵", m),
  };

  const worker = await createWorker(opts);
  await worker.loadLanguage("eng");
  await worker.initialize("eng");
  return worker;
})();
// -----------------------------------------------------------

export async function POST(req: NextRequest) {
  console.log("✅ OCR route hit");

  try {
    const { imageBase64 } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64" }, { status: 400 });
    }

    const buffer = Buffer.from(imageBase64, "base64");
    const worker = await workerPromise;            // reuse if warm
    const { data } = await worker.recognize(buffer);

    console.log("✅ Extracted text:", data.text.trim().slice(0, 60));
    return NextResponse.json({ text: data.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

