/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { createWorker, type WorkerParams } from "tesseract.js";

/* ------------------------------------------------------------------ */
/* 1️⃣  Worker boot‑strap with verbose logging                          */
/* ------------------------------------------------------------------ */

type WorkerOpts = Partial<WorkerParams> & {
  corePath: string;
  logger: (m: unknown) => void;
};

console.log("🔧 Creating Tesseract worker promise…");

const workerPromise = (async () => {
  try {
    const opts: WorkerOpts = {
      corePath: "/tesseract-core-simd.wasm",
      logger: m => console.log("🪵  OCR progress", m),
    };

    console.log("🚀 createWorker() starting");
    const worker: any = await createWorker(opts as any);
    console.log("✅ createWorker() resolved");

    console.log("🌐 Loading language ‘eng’");
    await worker.loadLanguage("eng");
    console.log("✅ Language loaded");

    console.log("⚙️  Initializing worker");
    await worker.initialize("eng");
    console.log("✅ Worker initialized");

    return worker;
  } catch (e) {
    console.error("❌ Worker boot failed:", e);
    throw e; // bubble so requests fail fast
  }
})();

/* ------------------------------------------------------------------ */
/* 2️⃣  Request handler                                                 */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  console.log("📥 POST /api/ocr hit");

  try {
    /* ---- parse body ---- */
    console.log("🔍 Reading request body");
    const { imageBase64 } = await req.json();
    if (!imageBase64) {
      console.log("⚠️  imageBase64 missing");
      return NextResponse.json(
        { error: "Missing imageBase64" },
        { status: 400 }
      );
    }
    console.log("✅ imageBase64 present, length:", imageBase64.length);

    /* ---- decode image ---- */
    console.log("🧩 Converting base64 → Buffer");
    const buffer = Buffer.from(imageBase64, "base64");
    console.log("✅ Buffer size:", buffer.length, "bytes");

    /* ---- perform OCR ---- */
    console.log("👷 Awaiting workerPromise");
    const worker: any = await workerPromise;
    console.log("✅ Worker ready (warm)");

    console.time("⏱  recognize");
    const { data } = await worker.recognize(buffer);
    console.timeEnd("⏱  recognize");

    /* ---- return text ---- */
    const preview = data.text.trim().slice(0, 80);
    console.log("📤 OCR text (preview):", preview);

    return NextResponse.json({ text: data.text });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("❌ OCR route failed:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

