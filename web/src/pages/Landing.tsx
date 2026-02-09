import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, Zap, Brain } from 'lucide-react';
import { ActionCard } from '@/components/ActionCard';

export const LandingPage: React.FC = () => {
  const demoAction = {
    id: 'demo',
    title: 'Review Project Roadmap',
    why_this: 'Clarifying the path forward will reduce anxiety and unblock your team.',
    steps: [
      'Open the project board in Notion/Jira',
      'Identify 3 critical blockers',
      'Schedule a 15-min sync with the team lead'
    ],
    time_minutes: 15,
    difficulty: 2,
    success_criteria: 'List of blockers sent to team lead',
    fallback_if_stuck: 'Just list one blocker and send it.'
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
              Stop Thinking.<br />Start Doing.
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg leading-relaxed">
              An AI-powered executive function engine that breaks down your goals into immediate, actionable steps based on your current energy and context.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/onboarding">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-lg hover:shadow-primary/25 transition-all">
                  Get Started <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to="/billing">
                <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full">
                  View Pricing
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/30 to-purple-500/30 blur-3xl opacity-30 rounded-full" />
            <ActionCard action={demoAction} className="relative z-10 transform hover:-translate-y-1 transition-transform duration-300" />
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Brain className="w-10 h-10 text-primary" />}
              title="Cognitive Offloading"
              description="Don't waste energy deciding what to do. Let AI analyze your goals and context to pick the perfect next step."
            />
            <FeatureCard 
              icon={<Zap className="w-10 h-10 text-yellow-500" />}
              title="Energy Aware"
              description="Low energy? We'll give you a quick win. High energy? We'll tackle the big rocks. Tailored to your state."
            />
            <FeatureCard 
              icon={<CheckCircle className="w-10 h-10 text-green-500" />}
              title="Momentum Builder"
              description="Micro-steps designed to get you into flow state immediately. Overcome procrastination with precision."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="p-8 rounded-2xl bg-card border hover:border-primary/50 transition-colors shadow-sm">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{description}</p>
  </div>
);
