import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '@/lib/api';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, Clock, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface HistoryItem {
  id: string;
  title: string;
  why_this: string;
  time_minutes: number;
  difficulty: number;
  createdAt: string;
  // Add other fields as needed
}

export const History: React.FC = () => {
  const { getToken } = useAuth();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = await getToken();
        setAuthToken(token);
        const response = await api.get('/action/history');
        // response.data should be an array or { actions: [...] } depending on API
        // Assuming API returns array directly or inside a property. 
        // Based on previous prompts: "GET /history returns last 20 actions"
        setHistory(Array.isArray(response.data) ? response.data : response.data.actions || []);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getToken]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">Your past actions and accomplishments.</p>
      </div>

      <div className="grid gap-4">
        {history.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No actions recorded yet. Go generate some!
          </div>
        ) : (
          history.map((item) => (
            <Card key={item.id} className="hover:bg-secondary/10 transition-colors">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{item.title}</CardTitle>
                    <CardDescription>{item.why_this}</CardDescription>
                  </div>
                  <Badge variant="outline" className="ml-2 whitespace-nowrap">
                    {format(new Date(item.createdAt), 'MMM d, h:mm a')}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.time_minutes} min
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    Level {item.difficulty}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
