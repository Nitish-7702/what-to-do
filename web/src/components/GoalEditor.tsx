import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, ListTodo } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface GoalEditorProps {
  goals: string[];
  onChange: (goals: string[]) => void;
}

export const GoalEditor: React.FC<GoalEditorProps> = ({ goals, onChange }) => {
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim()) {
      onChange([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const removeGoal = (index: number) => {
    onChange(goals.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addGoal();
    }
  };

  return (
    <Card className="h-full border-none shadow-none bg-transparent">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-lg flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-primary" />
          Your Top Goals
        </CardTitle>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="flex gap-2">
          <Input
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a new goal..."
            className="bg-background/50"
          />
          <Button onClick={addGoal} size="icon" disabled={!newGoal.trim()}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <ul className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
          <AnimatePresence mode="popLayout">
            {goals.map((goal, index) => (
              <motion.li
                key={`${goal}-${index}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between gap-2 p-3 rounded-md bg-secondary/30 border border-border/50 group"
              >
                <span className="text-sm">{goal}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeGoal(index)}
                >
                  <X className="w-3 h-3 text-muted-foreground" />
                </Button>
              </motion.li>
            ))}
            {goals.length === 0 && (
              <motion.li 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-muted-foreground text-sm py-8 border-2 border-dashed rounded-lg"
              >
                No goals set. Add one to get started!
              </motion.li>
            )}
          </AnimatePresence>
        </ul>
      </CardContent>
    </Card>
  );
};
