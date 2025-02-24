"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Unplug, UndoDot as Back } from "lucide-react";
import { useLocation } from "wouter"; // I went through next/navigation, next/router, AND react-router-dom for stupid vite to not like me.. Sigh.
import { useEffect, useState } from "react";

export default function NotFound() {
  const [, navigate] = useLocation();

  // Specify list of random messages:
  const messages = [
    "Oops! Looks like you're lost.",
    "This page vanished into the void!",
    "Well, this is awkward...",
    "Are you sure this was the right way?",
    "Nothing to see here... or is there?"
  ];

  // Pick out a random message from the list above:
  const [randomMessage, setRandomMessage] = useState("");

  useEffect(() => {
    setRandomMessage(messages[Math.floor(Math.random() * messages.length)]);
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-6 flex flex-col items-center">
          <Unplug className="h-10 w-10 text-blue-500 mb-4" />
          <h1 className="text-2xl font-bold text-white">404 (Not Found):</h1>
          <p className="text-gray-400 mt-2">{randomMessage}</p> {/* Specify the random message from the randomized variable. */}
          <button
            type="button"
            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-xl transition flex items-center gap-2 hover:bg-[#4A89F3]"
            onClick={() => navigate("/")} // Specify correct Wouter package navigation/handling.
          >
            <Back className="h-5 w-5" /> Go Home
          </button>
        </CardContent>
      </Card>
    </div>
  );
}
