import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { GoalEditor } from '@/components/GoalEditor';
import { ConstraintPicker } from '@/components/ConstraintPicker';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';
import { api } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { useToast } from '@/components/ui/use-toast';

export const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [goals, setGoals] = useState<string[]>([]);
  const [constraints, setConstraints] = useState({
    energy: 70,
    time: 30,
    context: 'At desk'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { toast } = useToast();

  const totalSteps = 3;

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      await generateFirstAction();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const generateFirstAction = async () => {
    setIsGenerating(true);
    try {
      const token = await getToken();
      // We don't have a specific "save onboarding" endpoint, but we can generate the next action directly.
      // Ideally, we should save the goals to the user profile or DB first.
      // For now, we'll pass them directly to the next-action endpoint or just navigate to dashboard with state.
      // But wait, the Dashboard needs to know these things.
      // Let's assume the user profile stores goals? 
      // The prompt says "goals fetched from DB if not provided".
      // So we should probably send them in the request.
      
      // Let's navigate to Dashboard and pass the state, OR call the API here and pass the result.
      // Navigating to Dashboard and letting it fetch is better, but we need to persist goals.
      // Since we don't have a "save goals" endpoint yet (based on previous turns), 
      // I will assume we should just navigate to the dashboard and maybe pass these as query params or local storage?
      // Actually, looking at the API, /next-action takes goals[].
      // So I'll store them in localStorage for now so the Dashboard can pick them up, 
      // or I can just trigger the first action generation here and then go to dashboard.
      
      // Let's try to generate the action here to show it works, then navigate.
      // Or better: Save to localStorage and let Dashboard handle the "First Load" experience.
      
      localStorage.setItem('user_goals', JSON.stringify(goals));
      localStorage.setItem('user_constraints', JSON.stringify(constraints));
      
      navigate('/');
      
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-lg space-y-4">
        <div className="space-y-2 text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Let's get calibrated</h1>
          <p className="text-muted-foreground">Help us understand your context to provide the best actions.</p>
        </div>

        <div className="relative mb-8">
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <div className="absolute top-4 right-0 text-xs text-muted-foreground">Step {step} of {totalSteps}</div>
        </div>

        <Card className="border-2 shadow-lg overflow-hidden relative min-h-[400px] flex flex-col">
          <CardContent className="flex-1 pt-6">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4 h-full"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-xl font-semibold">What's on your mind?</h2>
                    <p className="text-sm text-muted-foreground">List your top 3-5 active projects or goals.</p>
                  </div>
                  <GoalEditor goals={goals} onChange={setGoals} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <div className="space-y-2 mb-6">
                    <h2 className="text-xl font-semibold">Current Status</h2>
                    <p className="text-sm text-muted-foreground">How are you feeling right now?</p>
                  </div>
                  <ConstraintPicker values={constraints} onChange={setConstraints} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-6"
                >
                  <div className="p-6 bg-primary/10 rounded-full">
                    <Check className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold">You're all set!</h2>
                    <p className="text-muted-foreground">We're ready to generate your first next action.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between bg-secondary/20 p-6">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
              <ArrowLeft className="mr-2 w-4 h-4" /> Back
            </Button>
            <Button onClick={handleNext} disabled={step === 1 && goals.length === 0}>
              {step === totalSteps ? (isGenerating ? 'Generating...' : 'Start') : 'Next'} 
              {step !== totalSteps && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};
