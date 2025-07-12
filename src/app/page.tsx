'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  "John (52): This website has helped me save 30% on my monthly prescription costs!",
  "Maria (45): I saved over $80 last month! Unbelievable.",
  "Carlos (34): Finally found affordable meds. Highly recommend.",
  "Emily (60): Saved $55 on blood pressure meds.",
  "David (73): My insulin costs are down $100/mo.",
  "Aisha (29): Uploading my prescription was super easy.",
  "Tom (67): Great support and real savings.",
  "Linda (59): It showed me 3 cheaper pharmacies instantly!",
  "Noah (40): Rx costs were killing me. Not anymore.",
  "Priya (70): My monthly spend dropped 25%."
];

export default function Home() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleOCR = async () => {
    console.log("🧠 OCR button clicked");

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (!fileInput?.files?.[0]) {
      alert("Please upload a .png file first.");
      return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = async () => {
      const base64 = (reader.result as string).split(",")[1];

      console.log("📸 Image base64 starts with:", base64.substring(0, 30));

      try {
        const res = await fetch("/api/ocr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const json = await res.json();

        console.log("🧾 OCR response:", json);

        if (res.ok) {
          if (json.text?.trim()) {
            alert("🎉 Congratulations! Your file was converted to text:\n\n" + json.text);
          } else {
            alert("✅ OCR completed, but no readable text was found.");
          }
        } else {
          alert("❌ Error: " + json.error);
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        alert("❌ Failed to reach the OCR API.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white px-4 sm:px-8 py-10">
      <div className="max-w-2xl mx-auto text-center">

        <Image
          src="/logo.png"
          alt="Logo"
          width={112}
          height={112}
          className="mx-auto mb-4"
        />

        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Save Money on Your Prescriptions!
        </h1>

        <p className="text-lg mb-4 text-gray-700">
          <strong>70%</strong> of users save <strong>25%</strong> or more each month. Joan (68) saved <strong>$112/month</strong> on insulin.
          Upload your prescriptions for instant price comparisons!
        </p>

        <motion.div
          key={testimonialIndex}
          className="text-base italic text-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {testimonials[testimonialIndex]}
        </motion.div>

        <div className="text-sm text-gray-600 mb-6">
          🔒 HIPAA-compliant & Secure • 📦 Trusted by 1,200+ users • 🧠 AI-powered analysis
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
              <label className="text-left text-sm font-medium text-gray-700">
                Upload Your Prescription (.png):
              </label>
              <Input type="file" accept=".png" />
              <Button type="submit" className="text-lg py-3">
                🔍 Compare Prices
              </Button>
            </form>
          </CardContent>
        </Card>

        <Button
          onClick={handleOCR}
          className="mt-6 text-lg py-3 bg-green-600 hover:bg-green-700"
        >
          🧠 Convert .png to .txt via OCR
        </Button>

        <footer className="mt-12 text-center text-sm text-gray-500">
          &copy; 2025 SaveMoneyOnYourMeds. All rights reserved. •{" "}
          <a href="#" className="underline">Privacy</a> •{" "}
          <a href="#" className="underline">Contact</a>
        </footer>
      </div>
    </div>
  );
}

