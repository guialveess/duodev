import { NextResponse } from "next/server";
import { HfInference } from "@huggingface/inference";

const hf = new HfInference(process.env.HUGGINGFACE_API_KEY);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file || !file.type.startsWith("audio/") || file.size === 0) {
      return NextResponse.json(
        { error: "Invalid audio file" },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();

    const { text } = await hf.automaticSpeechRecognition({
      model: "openai/whisper-tiny",
      data: new Uint8Array(buffer),
      parameters: {
        language: "en",
      },
    });

    return NextResponse.json({ transcription: text });
  } catch (error) {
    console.error("Transcription error:", error);
    return NextResponse.json(
      { error: "Failed to process audio" },
      { status: 500 }
    );
  }
}
