"use client";

import { Mic } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

interface AudioRecorderProps {
  onTranscriptionComplete: (transcription: string) => void;
  visualizerBars?: number;
  className?: string;
}

export function AudioRecorder({
  onTranscriptionComplete,
  visualizerBars = 48,
  className,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [time, setTime] = useState(0);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error("Seu navegador não suporta reconhecimento de fala.");
      return;
    }
  }, [browserSupportsSpeechRecognition]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (listening) {
      intervalId = setInterval(() => setTime((t) => t + 1), 1000);
    } else {
      if (transcript) {
        onTranscriptionComplete(transcript); 
        resetTranscript(); 
      }
      setTime(0); 
      setIsProcessing(false);
    }

    return () => clearInterval(intervalId);
  }, [listening, transcript, onTranscriptionComplete, resetTranscript]);

  const startRecording = () => {
    setIsRecording(true);
    setIsProcessing(true);
    SpeechRecognition.startListening({ language: "en-US" }); 
  };

  const stopRecording = () => {
    setIsRecording(false);
    SpeechRecognition.stopListening(); 
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className={cn("w-full py-4", className)}>
      <div className="relative max-w-xl w-full mx-auto flex items-center flex-col gap-2">
        <button
          className={cn(
            "group w-16 h-16 rounded-xl flex items-center justify-center transition-colors",
            isRecording || isProcessing
              ? "bg-none"
              : "bg-none hover:bg-black/10 dark:hover:bg-white/10"
          )}
          type="button"
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
        >
          {isRecording ? (
            <div
              className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white cursor-pointer pointer-events-auto"
              style={{ animationDuration: "3s" }}
            />
          ) : isProcessing ? (
            <div className="w-6 h-6 rounded-sm animate-spin bg-black dark:bg-white" />
          ) : (
            <Mic className="w-6 h-6 text-black/70 dark:text-white/70" />
          )}
        </button>

        <span
          className={cn(
            "font-mono text-sm transition-opacity duration-300",
            isRecording || isProcessing
              ? "text-black/70 dark:text-white/70"
              : "text-black/30 dark:text-white/30"
          )}
        >
          {formatTime(time)}
        </span>

        <div className="h-4 w-64 flex items-center justify-center gap-0.5">
          {[...Array(visualizerBars)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-0.5 rounded-full transition-all duration-300",
                isRecording
                  ? "bg-black/50 dark:bg-white/50 animate-pulse"
                  : "bg-black/10 dark:bg-white/10 h-1"
              )}
              style={
                isRecording
                  ? {
                      height: `${20 + Math.random() * 80}%`,
                      animationDelay: `${i * 0.05}s`,
                    }
                  : undefined
              }
            />
          ))}
        </div>

        <p className="h-4 text-xs text-black/70 dark:text-white/70">
          {isRecording
            ? "Ouvindo..."
            : isProcessing
            ? "Pensando no que você disse..."
            : "Clique para falar"}
        </p>
      </div>
    </div>
  );
}