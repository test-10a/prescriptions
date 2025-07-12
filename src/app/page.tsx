'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 to-white p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Save Money on Your Prescriptions!</h1>
        <p className="text-lg mb-4">
          <strong>70%</strong> of users save <strong>25%</strong> or more each month. Joan (68) saved <strong>$112/month</strong> on insulin. Upload your prescriptions for instant price comparisons!
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

        <Card className="shadow-lg">
          <CardContent className="p-6">
            <form className="flex flex-col gap-4">
              <label className="text-left text-sm font-medium">Upload Your Prescription (.png):</label>
              <Input type="file" accept=".png" />
              <Button type="submit">Compare Prices</Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6">
          <a
            href="https://github.com/YOUR_USERNAME/ocr-prescription-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-blue-600 hover:text-blue-800"
          >
            Go to OCR Tool (.png to .txt Python Script)
          </a>
        </div>
      </div>
    </div>
  );
}

