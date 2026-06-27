import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { GoogleGenAI } from "@google/genai";
import { checkRateLimit } from "@/lib/rate-limit";

export const maxDuration = 60; // Allow up to 60 seconds for execution

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Rate Limiting
    const ip = request.headers.get("x-forwarded-for") || "127.0.0.1";
    const isAllowed = await checkRateLimit(ip);
    if (!isAllowed) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }
    
    // Authenticate
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filePath } = await request.json();
    if (!filePath) {
      return NextResponse.json({ error: "Missing filePath" }, { status: 400 });
    }

    // Download audio file from Supabase Storage securely
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("voice-notes")
      .download(filePath);

    if (downloadError || !fileData) {
      console.error("Failed to download from storage:", downloadError);
      return NextResponse.json({ error: "Failed to fetch audio file" }, { status: 500 });
    }

    // Convert Blob to Base64
    const arrayBuffer = await fileData.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = fileData.type || "audio/webm";

    // Transcribe with Gemini 2.5 Flash
    if (!process.env.GEMINI_API_KEY) {
      console.warn("No GEMINI_API_KEY found, falling back to mock transcription.");
      // Mock transcription for development without keys
      return NextResponse.json({
        transcript: "This is a fallback mock transcript. The GEMINI_API_KEY is not set in the environment variables."
      });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { inlineData: { data: base64Data, mimeType } },
            { text: "Transcribe the following audio accurately. Return ONLY the transcription text without any additional markdown or formatting." }
          ]
        }
      ]
    });

    return NextResponse.json({ transcript: response.text });
  } catch (error: any) {
    console.error("Transcription Error:", error);
    return NextResponse.json(
      { error: "Transcription failed.", details: error.message },
      { status: 500 }
    );
  }
}
