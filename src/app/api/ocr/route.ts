export const runtime = "nodejs";          // full Node runtime

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
    logger: m => console.log("🪵", m),       // progress in Vercel logs
  };

  // cast because outdated d.ts accepts only strings
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const worker: any = await createWorker(opts as any);

  await worker.loadLanguage("eng");          // worker is 'any', so TS allows this
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
    const worker: any = await workerPromise;            // reuse across warm calls
    const { data } = await worker.recognize(buffer);

    console.log("✅ Extracted text:", data.text.trim().slice(0, 60));
    return NextResponse.json({ text: data.text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

