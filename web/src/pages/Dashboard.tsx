import React, { useState, useEffect } from 'react';
import { api, setAuthToken } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { ActionCard, Action } from '@/components/ActionCard';
import { FocusTimer } from '@/components/FocusTimer';
import { GoalEditor } from '@/components/GoalEditor';
import { ConstraintPicker } from '@/components/ConstraintPicker';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../components/ui/sheet';
import { Settings, RefreshCw, Loader2, History as HistoryIcon } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';

export const Dashboard: React.FC = () => {
  const { getToken, userId } = useAuth();
  const { toast } = useToast();
  
  const [currentAction, setCurrentAction] = useState<Action | null>(null);
  const [loading, setLoading] = useState(false);
  const [goals, setGoals] = useState<string[]>([]);
  const [constraints, setConstraints] = useState({
    energy: 70,
    time: 30,
    context: 'At desk'
  });
  
  const [showFocusMode, setShowFocusMode] = useState(false);

  useEffect(() => {
    // Load from local storage on mount
    const savedGoals = localStorage.getItem('user_goals');
    const savedConstraints = localStorage.getItem('user_constraints');
    
    if (savedGoals) setGoals(JSON.parse(savedGoals));
    if (savedConstraints) setConstraints(JSON.parse(savedConstraints));
  }, []);

  useEffect(() => {
    // Save to local storage on change
    localStorage.setItem('user_goals', JSON.stringify(goals));
    localStorage.setItem('user_constraints', JSON.stringify(constraints));
  }, [goals, constraints]);

  const generateAction = async () => {
    if (goals.length === 0) {
      toast({
        title: "No goals set",
        description: "Please add at least one goal to get started.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      
      const response = await api.post('/action/next-action', {
        goals,
        energy: constraints.energy,
        availableMinutes: constraints.time,
        context: constraints.context
      });

      setCurrentAction(response.data.action);
      setShowFocusMode(false);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 403) {
         toast({
          title: "Limit Reached",
          description: error.response.data.message || "You have reached your daily limit.",
          variant: "destructive",
          action: <Link to="/billing"><Button variant="outline" size="sm">Upgrade</Button></Link>
        });
      } else {
        toast({
          title: "Generation Failed",
          description: "Could not generate an action. Please try again.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = () => {
    toast({
      title: "Great job!",
      description: "Action completed. Ready for the next one?",
    });
    setCurrentAction(null);
    setShowFocusMode(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Focus on what matters now.</p>
        </div>
        <div className="flex gap-2">
           <Link to="/history">
            <Button variant="outline" size="icon">
              <HistoryIcon className="w-4 h-4" />
            </Button>
           </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Sidebar: Controls */}
        <div className="space-y-6 lg:col-span-1">
          <Card className="p-4 border-none shadow-none bg-transparent lg:bg-card lg:border lg:shadow-sm">
            <div className="space-y-6">
              <GoalEditor goals={goals} onChange={setGoals} />
              <div className="h-px bg-border" />
              <ConstraintPicker values={constraints} onChange={setConstraints} />
              <Button 
                onClick={generateAction} 
                disabled={loading} 
                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Thinking...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-5 w-5" /> Generate Next Action
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Main Content: Action & Timer */}
        <div className="lg:col-span-2 space-y-6">
          {currentAction ? (
            <div className="space-y-6">
              {!showFocusMode ? (
                <div className="space-y-6">
                  <ActionCard action={currentAction} onComplete={handleComplete} />
                  <div className="flex justify-center">
                    <Button 
                      variant="secondary" 
                      size="lg" 
                      onClick={() => setShowFocusMode(true)}
                      className="gap-2"
                    >
                      Start Focus Mode
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="max-w-xl mx-auto space-y-6">
                   <div className="text-center space-y-2">
                     <h2 className="text-2xl font-bold">{currentAction.title}</h2>
                     <p className="text-muted-foreground">Focus time. You got this.</p>
                   </div>
                   <FocusTimer 
                      durationMinutes={currentAction.time_minutes} 
                      onComplete={handleComplete} 
                   />
                   <Button variant="ghost" onClick={() => setShowFocusMode(false)} className="w-full">
                     Exit Focus Mode
                   </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-xl bg-secondary/10 text-muted-foreground">
              <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                <RefreshCw className="w-8 h-8 text-primary opacity-50" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Ready to work?</h3>
              <p className="max-w-md mx-auto mb-6">
                Configure your context on the left and click "Generate Next Action" to get a personalized task.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
