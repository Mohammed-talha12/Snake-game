import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'DATA_STREAM_01.WAV', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'CORRUPTED_SECTOR.MP3', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'VOID_RESONANCE.FLAC', src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("ERR_AUDIO_PLAY:", e));
    } else if (!isPlaying && audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    handleNext();
  };

  return (
    <div className="bg-black border-4 border-cyan-500 p-4 flex flex-col items-center w-full max-w-md mx-auto relative group">
      {/* Glitch decorative elements */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-fuchsia-500 -translate-x-2 -translate-y-2" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-fuchsia-500 translate-x-2 translate-y-2" />
      
      <audio
        ref={audioRef}
        src={TRACKS[currentTrackIndex].src}
        onEnded={handleEnded}
        loop={false}
      />
      
      <div className="text-center mb-6 w-full border-b-2 border-dashed border-cyan-500/50 pb-4">
        <h3 className="text-fuchsia-500 font-display text-xs uppercase tracking-widest mb-2">
          [AUDIO_UPLINK_ACTIVE]
        </h3>
        <p className="text-cyan-400 font-mono text-xl truncate w-full bg-cyan-900/30 p-1">
          &gt; {TRACKS[currentTrackIndex].title}
        </p>
      </div>

      <div className="flex items-center justify-between w-full mb-4 px-4">
        <button onClick={handlePrev} className="text-cyan-500 hover:text-black hover:bg-cyan-500 p-2 transition-none border-2 border-transparent hover:border-cyan-500">
          <SkipBack size={24} />
        </button>
        
        <button 
          onClick={handlePlayPause} 
          className="w-16 h-12 flex items-center justify-center bg-transparent border-2 border-fuchsia-500 text-fuchsia-500 hover:bg-fuchsia-500 hover:text-black transition-none"
        >
          {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" className="ml-1" />}
        </button>
        
        <button onClick={handleNext} className="text-cyan-500 hover:text-black hover:bg-cyan-500 p-2 transition-none border-2 border-transparent hover:border-cyan-500">
          <SkipForward size={24} />
        </button>
      </div>

      <div className="flex items-center w-full space-x-4 px-4 bg-gray-900 p-2 border border-cyan-900">
        <button onClick={() => setIsMuted(!isMuted)} className="text-fuchsia-500 hover:text-white transition-none">
          {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            setVolume(parseFloat(e.target.value));
            if (isMuted) setIsMuted(false);
          }}
          className="w-full h-2 bg-black border border-cyan-500 appearance-none cursor-pointer accent-fuchsia-500"
        />
      </div>
    </div>
  );
}
