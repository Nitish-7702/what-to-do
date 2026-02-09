import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Wait, I didn't create Badge. I should create it or use standard HTML. I'll create Badge.
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, Zap, Target, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// I'll create a simple Badge component inline or separately. Let's create it separately for reusability.
// But for now, I'll assume it exists or use a simple span. I'll create src/components/ui/badge.tsx first.

export interface Action {
  id: string;
  title: string;
  why_this: string;
  steps: string[];
  time_minutes: number;
  difficulty: number; // 1-5
  success_criteria: string;
  fallback_if_stuck: string;
}

interface ActionCardProps {
  action: Action;
  onComplete?: () => void;
  className?: string;
}

const container = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

export const ActionCard: React.FC<ActionCardProps> = ({ action, onComplete, className }) => {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn("w-full max-w-2xl mx-auto", className)}
    >
      <Card className="border-2 border-primary/10 shadow-xl overflow-hidden bg-gradient-to-br from-card to-secondary/10">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold text-primary">{action.title}</CardTitle>
              <CardDescription className="text-lg font-medium text-foreground/80">
                {action.why_this}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                <Clock className="w-4 h-4" />
                {action.time_minutes} min
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground bg-secondary px-3 py-1 rounded-full">
                <Zap className="w-4 h-4 text-yellow-500" />
                Level {action.difficulty}
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4" /> Action Steps
            </h4>
            <ul className="space-y-3">
              {action.steps.map((step, i) => (
                <motion.li 
                  key={i} 
                  variants={item}
                  className="flex items-start gap-3 p-3 rounded-lg bg-background/50 border border-border/50 hover:border-primary/20 transition-colors"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </span>
                  <span className="text-base leading-relaxed">{step}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/10 space-y-2">
              <h5 className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Success Criteria
              </h5>
              <p className="text-sm text-green-900/80 dark:text-green-300/80">{action.success_criteria}</p>
            </div>
            
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/10 space-y-2">
              <h5 className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" /> Stuck?
              </h5>
              <p className="text-sm text-amber-900/80 dark:text-amber-300/80">{action.fallback_if_stuck}</p>
            </div>
          </div>
        </CardContent>

        {onComplete && (
          <CardFooter className="bg-secondary/20 p-6 flex justify-end">
            <Button size="lg" onClick={onComplete} className="w-full sm:w-auto text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
              <CheckCircle2 className="w-5 h-5" />
              Mark Complete
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};
