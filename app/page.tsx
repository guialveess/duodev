"use client";
import { useState } from "react";
import { AudioRecorder } from "@/app/components/AudioRecorder";
import { LayoutGroup, motion } from "framer-motion";
import { TextRotate } from "@/app/components/ui/text-rotate";

const Home = () => {
  const [transcription, setTranscription] = useState("");

  const handleRecordingComplete = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append("file", audioBlob, "audio.webm");

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      setTranscription(result.transcription || "Erro na transcrição");
    } catch (error) {
      console.error("Erro:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <AudioRecorder onRecordingComplete={handleRecordingComplete} />
      {transcription && (
        <div className="mt-8 text-center">
          <div className="flex flex-row items-center justify-center dark:text-muted text-foreground font-light overflow-hidden">
            <LayoutGroup>
              <motion.div className="flex whitespace-pre-wrap" layout>
                <motion.span
                  className=""
                  layout
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                >
                  {" "}
                </motion.span>
                <TextRotate
                  texts={[transcription]} 
                  mainClassName="text-md text-black/70 dark:text-white/70 text-white px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                  staggerFrom={"first"}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "-120%" }}
                  staggerDuration={0.025}
                  splitLevelClassName="overflow-hidden"
                  transition={{ type: "spring", damping: 30, stiffness: 400 }}
                  rotationInterval={2000}
                />
              </motion.div>
            </LayoutGroup>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;