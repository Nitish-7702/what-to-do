import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Battery, Clock, MapPin } from 'lucide-react';

interface ConstraintPickerProps {
  values: {
    energy: number;
    time: number;
    context: string;
  };
  onChange: (values: { energy: number; time: number; context: string }) => void;
}

export const ConstraintPicker: React.FC<ConstraintPickerProps> = ({ values, onChange }) => {
  const handleEnergyChange = (val: number[]) => {
    onChange({ ...values, energy: val[0] });
  };

  const handleTimeChange = (val: number[]) => {
    onChange({ ...values, time: val[0] });
  };

  const handleContextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...values, context: e.target.value });
  };

  const getEnergyLabel = (val: number) => {
    if (val < 30) return "Low";
    if (val < 70) return "Medium";
    return "High";
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2 text-base">
              <Battery className="w-4 h-4 text-primary" />
              Energy Level
            </Label>
            <span className="text-sm font-medium text-muted-foreground">{values.energy}% ({getEnergyLabel(values.energy)})</span>
          </div>
          <Slider
            value={[values.energy]}
            max={100}
            step={5}
            onValueChange={handleEnergyChange}
            className="py-2"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="flex items-center gap-2 text-base">
              <Clock className="w-4 h-4 text-primary" />
              Available Time
            </Label>
            <span className="text-sm font-medium text-muted-foreground">{values.time} minutes</span>
          </div>
          <Slider
            value={[values.time]}
            min={5}
            max={120}
            step={5}
            onValueChange={handleTimeChange}
            className="py-2"
          />
        </div>

        <div className="space-y-4">
          <Label className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4 text-primary" />
            Current Context
          </Label>
          <Input 
            value={values.context} 
            onChange={handleContextChange}
            placeholder="e.g., At desk, On phone, Commuting..."
            className="bg-background/50"
          />
        </div>
      </CardContent>
    </Card>
  );
};
