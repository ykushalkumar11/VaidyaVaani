import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, Play, Square, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePrescriptionContext } from "@/context/PrescriptionContext";
import { useGenerateAudio } from "@/hooks/use-prescriptions";
import { EmptyState } from "@/components/EmptyState";
import { useToast } from "@/hooks/use-toast";

export function VoiceTab() {
  const { parsedData } = usePrescriptionContext();
  const { mutate: generateAudio, isPending } = useGenerateAudio();
  const { toast } = useToast();
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  if (!parsedData) {
    return (
      <EmptyState 
        title="No Audio Available" 
        description="Please parse a prescription first to generate accessible voice output." 
      />
    );
  }

  const handleGenerate = () => {
    if (!parsedData.tts_ready_text) return;
    
    generateAudio(parsedData.tts_ready_text, {
      onSuccess: (blob) => {
        if (audioUrl) URL.revokeObjectURL(audioUrl);
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
        toast({ title: "Audio Generated", description: "You can now listen to the instructions." });
      },
      onError: (err) => {
        toast({ variant: "destructive", title: "Error", description: err.message });
      }
    });
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

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="inline-flex w-16 h-16 rounded-full bg-teal-100 text-teal-600 items-center justify-center mb-2">
          <Volume2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-display font-bold text-slate-800">Voice Assistant Output</h2>
        <p className="text-slate-500">Listen to clear, spoken instructions derived from your prescription.</p>
      </div>

      <Card className="shadow-xl border-0 shadow-slate-200/50 bg-white">
        <CardContent className="p-8 space-y-8">
          
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">Script Ready for Audio</h3>
            <p className="text-lg text-slate-700 leading-relaxed italic">
              "{parsedData.tts_ready_text}"
            </p>
          </div>

          <div className="flex flex-col items-center justify-center gap-6 pt-4 border-t border-slate-100">
            {!audioUrl ? (
              <Button 
                size="lg" 
                className="rounded-full px-8 h-14 bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white shadow-lg shadow-teal-500/25 transition-all text-lg font-semibold"
                onClick={handleGenerate}
                disabled={isPending}
              >
                {isPending ? (
                  <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Generating Audio...</>
                ) : (
                  <><Volume2 className="w-5 h-5 mr-3" /> Generate Audio & Listen</>
                )}
              </Button>
            ) : (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }} 
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-6"
              >
                <audio 
                  ref={audioRef} 
                  src={audioUrl} 
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
                
                <Button 
                  size="icon"
                  className={`w-20 h-20 rounded-full shadow-xl transition-all duration-300 ${
                    isPlaying 
                    ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/30' 
                    : 'bg-teal-500 hover:bg-teal-600 shadow-teal-500/30'
                  }`}
                  onClick={togglePlayback}
                >
                  {isPlaying ? (
                    <Square className="w-8 h-8 text-white fill-current" />
                  ) : (
                    <Play className="w-8 h-8 text-white fill-current ml-1" />
                  )}
                </Button>
                
                <div className="flex flex-col">
                  <span className="font-bold text-slate-800 text-lg">
                    {isPlaying ? "Playing..." : "Ready to play"}
                  </span>
                  <span className="text-slate-500 text-sm">
                    High quality synthesized voice
                  </span>
                </div>
              </motion.div>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}
