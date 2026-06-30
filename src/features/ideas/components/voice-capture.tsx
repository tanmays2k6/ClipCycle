"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Mic, Square, Play, Pause, RefreshCw, FileText, Sparkles, ArrowRight, Settings } from "lucide-react";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function VoiceCapture() {
  const router = useRouter();
  
  // Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  
  // Audio playback and data states
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioFilePath, setAudioFilePath] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Text content states
  const [title, setTitle] = useState("");
  const [transcript, setTranscript] = useState("");
  const [originalTranscript, setOriginalTranscript] = useState("");
  
  // UI flow states
  const [isGeneratingTranscript, setIsGeneratingTranscript] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Refs for media and intervals
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Simulated waveform bar heights
  const [waveHeights, setWaveHeights] = useState<number[]>(
    Array.from({ length: 32 }, () => 8)
  );

  // Handle Recording Timer and Waveform
  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 900) { // 15 mins hard limit
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
        // Randomize wave heights during recording (would be replaced by Web Audio API analyzer in future)
        setWaveHeights(Array.from({ length: 32 }, () => Math.floor(Math.random() * 32) + 8));
      }, 1000);
    } else {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    }
    return () => {
      if (recordingIntervalRef.current) clearInterval(recordingIntervalRef.current);
    };
  }, [isRecording]);

  // Handle Audio Element initialization
  useEffect(() => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        setIsPlaying(false);
        if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
      };
      audioRef.current = audio;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  // Handle Playback visual timer
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      playbackIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
           // update visual state if needed based on audioRef.current.currentTime
        }
      }, 100);
    } else {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    }
    return () => {
      if (playbackIntervalRef.current) clearInterval(playbackIntervalRef.current);
    };
  }, [isPlaying]);

  const requestMicrophoneAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      setHasPermission(true);
      setShowPermissionModal(false);
      return stream;
    } catch (err) {
      console.error("Microphone access denied:", err);
      setHasPermission(false);
      setShowPermissionModal(true);
      return null;
    }
  };

  const startRecording = async () => {
    let stream = streamRef.current;
    if (!stream) {
      stream = await requestMicrophoneAccess();
      if (!stream) return;
    }

    audioChunksRef.current = [];
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunksRef.current.push(event.data);
      }
    };

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      setAudioBlob(audioBlob);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
      
      // Release microphone
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      await handleUploadAndTranscribe(audioBlob);
    };

    mediaRecorder.start(200); // chunk every 200ms
    setIsRecording(true);
    setRecordingSeconds(0);
    setAudioUrl(null);
    setTranscript("");
    setAudioFilePath(null);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setWaveHeights(Array.from({ length: 32 }, () => 8));
      setTitle(`Voice Note - ${format(new Date(), "MMM d, h:mm a")}`);
    }
  };

  const handleUploadAndTranscribe = async (blob: Blob) => {
    setIsGeneratingTranscript(true);
    try {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error("Not logged in");

      // 1. Upload to Supabase Storage
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.webm`;
      const filePath = `${authData.user.id}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('voice-notes')
        .upload(filePath, blob, {
          contentType: 'audio/webm'
        });

      if (uploadError) throw uploadError;
      setAudioFilePath(filePath);

      // 2. Transcribe using Gemini via API
      const res = await fetch("/api/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath })
      });

      if (!res.ok) {
        throw new Error("Failed to transcribe audio");
      }

      const data = await res.json();
      setTranscript(data.transcript || "Transcription empty.");
      setOriginalTranscript(data.transcript || "Transcription empty.");
      
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to process voice note");
    } finally {
      setIsGeneratingTranscript(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const resetRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setAudioBlob(null);
    setAudioFilePath(null);
    setIsPlaying(false);
    setTitle("");
    setTranscript("");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSave = async () => {
    if (!audioFilePath || !transcript) {
      toast.error("Recording or transcript is missing");
      return;
    }

    setIsSaving(true);
    try {
      // 1. Create Idea
      const res = await fetch("/api/ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Untitled Voice Note",
          description: transcript,
          source: "voice",
          audioUrl: audioFilePath,
          duration: recordingSeconds,
          originalTranscript: originalTranscript
        })
      });

      if (!res.ok) throw new Error("Failed to save idea");
      const { idea } = await res.json();

      setSaved(true);
      toast.success("Voice note saved!");

      // 2. Trigger AI Analysis
      fetch("/api/ai/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea_id: idea.id,
          title: idea.title,
          description: idea.description,
          platform: "Any"
        })
      }).catch(err => console.error("Analysis failed:", err));

      // 3. Redirect
      setTimeout(() => {
        router.push(`/dashboard/ideas/${idea.id}`);
      }, 1000);

    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to save voice note");
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      
      {/* Permission Modal */}
      <AnimatePresence>
        {showPermissionModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
              className="bg-surface border border-border p-6 rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <Settings className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-h3">Microphone Access Denied</h3>
                  <p className="text-body">We need access to record voice notes.</p>
                </div>
              </div>
              <p className="text-body mb-6">
                Please allow microphone permissions in your browser settings and try again.
              </p>
              <div className="flex justify-end gap-3">
                <button onClick={() => setShowPermissionModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={requestMicrophoneAccess} className="btn-primary">
                  Retry Access
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Voice Recorder Hub */}
      <div className="p-6 rounded-2xl bg-surface/30 border border-border flex flex-col items-center justify-center space-y-6">
        {/* Waveform/Visualizer */}
        <div className="h-16 flex items-center justify-center gap-1.5 w-full max-w-md">
          {waveHeights.map((height, i) => (
            <motion.div
              key={i}
              animate={
                isRecording
                  ? { height: `${height}px` }
                  : isPlaying
                  ? { height: `${(i % 10) + 12}px` }
                  : { height: "8px" }
              }
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={cn(
                "w-1.5 rounded-full transition-colors duration-300",
                isRecording
                  ? "bg-red-500"
                  : isPlaying
                  ? "bg-violet-500"
                  : "bg-text-tertiary/40"
              )}
            />
          ))}
        </div>

        {/* Timers & Status */}
        <div className="text-center">
          <p className="text-h3">
            {isRecording ? "Recording Voice Note..." : audioUrl ? "Voice Note Recorded" : "Press Mic to Record"}
          </p>
          <p className="text-2xl font-bold font-mono text-text-secondary mt-1">
            {isRecording ? formatTime(recordingSeconds) : audioUrl ? formatTime(recordingSeconds) : "00:00"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4">
          {audioUrl && (
            <button
              onClick={resetRecording}
              className="p-3 rounded-xl bg-surface-hover border border-border text-text-tertiary hover:text-text-primary transition-colors"
              title="Record again"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          )}

          {!isRecording && !audioUrl ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={startRecording}
              className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20 hover:bg-red-400 transition-colors"
            >
              <Mic className="w-6 h-6 animate-pulse" />
            </motion.button>
          ) : isRecording ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={stopRecording}
              className="w-16 h-16 rounded-full bg-surface-hover border border-red-500/50 flex items-center justify-center text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <Square className="w-5 h-5 fill-red-400" />
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlayback}
              className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white shadow-lg shadow-violet-600/20 hover:bg-violet-500 transition-colors"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-white" />
              ) : (
                <Play className="w-5 h-5 fill-white translate-x-0.5" />
              )}
            </motion.button>
          )}

          {audioUrl && (
            <div className="w-11" /> // Spacer to balance layout
          )}
        </div>
      </div>

      {/* Title & Transcript Section */}
      <AnimatePresence>
        {audioUrl && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="space-y-5"
          >
            {/* Title */}
            <div className="form-group">
              <label className="label-base">
                Idea Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's this voice note about?"
                className="input-base"
              />
            </div>

            {/* Transcript */}
            <div className="p-4 rounded-xl bg-surface/40 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-text-secondary">
                  <FileText className="w-3.5 h-3.5" />
                  Generated Transcript
                </div>
                {isGeneratingTranscript && (
                  <span className="flex items-center gap-1 text-[11px] text-violet-400">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    Transcribing...
                  </span>
                )}
              </div>

              {isGeneratingTranscript ? (
                <div className="space-y-2 py-2">
                  <div className="h-3 w-5/6 rounded bg-surface-hover animate-pulse" />
                  <div className="h-3 w-4/6 rounded bg-surface-hover animate-pulse" />
                </div>
              ) : (
                  <textarea
                  value={transcript}
                  onChange={(e) => setTranscript(e.target.value)}
                  className="w-full bg-transparent text-body resize-none focus:outline-none min-h-[100px] border-none focus:ring-0 p-0"
                  placeholder="Your transcript will appear here..."
                />
              )}
            </div>

            {/* AI Note */}
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-violet-500/5 border border-violet-500/10">
              <Sparkles className="w-4 h-4 text-violet-400 shrink-0" />
              <p className="text-xs text-violet-300/80">
                AI has auto-transcribed the voice note and will extract key takeaways and tags.
              </p>
            </div>

            {/* Submit */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={isSaving || isGeneratingTranscript}
              className={cn(
                "btn-base w-full shadow-lg border-0",
                isSaving || isGeneratingTranscript
                  ? "bg-surface-hover text-text-tertiary cursor-not-allowed shadow-none"
                  : "bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-violet-600/20"
              )}
            >
              {saved ? (
                <>
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-emerald-300">✓</motion.span>
                  Idea Saved!
                </>
              ) : isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  Save Idea
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
