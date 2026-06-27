"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, Download, Volume2, FastForward } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AudioPlayerProps {
  filePath: string;
  duration?: number | null;
}

export function AudioPlayer({ filePath, duration }: AudioPlayerProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const speeds = [0.5, 1, 1.5, 2];

  useEffect(() => {
    const fetchUrl = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.storage.from("voice-notes").createSignedUrl(filePath, 3600);
      if (!error && data?.signedUrl) {
        setUrl(data.signedUrl);
      }
    };
    if (filePath) {
      fetchUrl();
    }
  }, [filePath]);

  useEffect(() => {
    if (url && !audioRef.current) {
      audioRef.current = new Audio(url);
      audioRef.current.onended = () => {
        setIsPlaying(false);
        setProgress(0);
        setCurrentTime(0);
      };
      audioRef.current.ontimeupdate = () => {
        if (audioRef.current) {
          setCurrentTime(audioRef.current.currentTime);
          if (audioRef.current.duration) {
            setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
          }
        }
      };
      audioRef.current.onloadedmetadata = () => {
        // Initialize duration if not passed
      };
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, [url]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !audioRef.current.duration) return;
    const seekTo = (parseFloat(e.target.value) / 100) * audioRef.current.duration;
    audioRef.current.currentTime = seekTo;
    setProgress(parseFloat(e.target.value));
    setCurrentTime(seekTo);
  };

  const toggleSpeed = () => {
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIndex]);
  };

  const handleDownload = async () => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filePath.split("/").pop() || "voice-note.webm";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  if (!url) {
    return (
      <div className="w-full h-16 rounded-xl bg-surface-hover border border-border flex items-center justify-center animate-pulse">
        <span className="text-xs text-text-tertiary">Loading audio...</span>
      </div>
    );
  }

  const displayDuration = audioRef.current?.duration && !isNaN(audioRef.current.duration) 
    ? audioRef.current.duration 
    : duration || 0;

  return (
    <div className="w-full p-4 rounded-xl bg-surface/40 border border-border space-y-3">
      <div className="flex items-center gap-4">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-10 h-10 shrink-0 rounded-full bg-violet-600 flex items-center justify-center text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
        >
          {isPlaying ? (
            <Pause className="w-4 h-4 fill-white" />
          ) : (
            <Play className="w-4 h-4 fill-white translate-x-0.5" />
          )}
        </button>

        {/* Progress Bar & Time */}
        <div className="flex-1 flex flex-col gap-1.5">
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-surface-hover rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-violet-500 [&::-webkit-slider-thumb]:rounded-full"
            style={{
              background: `linear-gradient(to right, #8b5cf6 ${progress}%, rgba(255,255,255,0.1) ${progress}%)`
            }}
          />
          <div className="flex justify-between text-[10px] font-mono text-text-tertiary">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(displayDuration)}</span>
          </div>
        </div>

        {/* Controls (Speed & Download) */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSpeed}
            className="px-2 py-1 h-8 rounded-lg bg-surface border border-border text-xs font-medium text-text-secondary hover:text-text-primary transition-colors min-w-[40px]"
          >
            {playbackRate}x
          </button>
          <button
            onClick={handleDownload}
            className="w-8 h-8 rounded-lg bg-surface border border-border flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            title="Download Audio"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
