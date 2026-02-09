import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface FocusTimerProps {
  durationMinutes?: number;
  onComplete?: () => void;
  className?: string;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({ 
  durationMinutes = 25, 
  onComplete,
  className 
}) => {
  const [timeLeft, setTimeLeft] = useState(durationMinutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          const newTime = prev - 1;
          setProgress((newTime / (durationMinutes * 60)) * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      onComplete?.();
      // Play a sound or notification here
      new Audio('/notification.mp3').play().catch(() => {}); // Simple fallback
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, durationMinutes, onComplete]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationMinutes * 60);
    setProgress(100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn("flex flex-col items-center gap-6 p-6 rounded-2xl bg-card border shadow-sm", className)}>
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Simple visualizer using SVG for a ring could be nice, but Progress bar is simpler for now. 
            Let's make a big text and a progress bar below.
        */}
        <div className="text-6xl font-mono font-bold tracking-tighter tabular-nums text-primary">
          {formatTime(timeLeft)}
        </div>
        
        {isActive && (
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-primary/20"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        )}
      </div>

      <Progress value={progress} className="h-2 w-full max-w-xs" />

      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={resetTimer}
          className="h-12 w-12 rounded-full"
        >
          <RotateCcw className="w-5 h-5" />
        </Button>

        <Button
          size="lg"
          onClick={toggleTimer}
          className={cn(
            "h-16 w-16 rounded-full transition-all shadow-lg hover:shadow-primary/25",
            isActive ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
          )}
        >
          {isActive ? (
            <Pause className="w-8 h-8 fill-current" />
          ) : (
            <Play className="w-8 h-8 fill-current ml-1" />
          )}
        </Button>
      </div>
    </div>
  );
};
