import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { api, setAuthToken } from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Loader2, CheckCircle, Zap, Shield } from 'lucide-react';

interface BillingStatus {
  plan: 'FREE' | 'PRO';
  usageCount: number;
  remaining: number | 'UNLIMITED';
  limit: number;
}

export default function Billing() {
  const { getToken } = useAuth();
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.get('/billing/status');
      setStatus(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.post('/billing/create-checkout-session');
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePortal = async () => {
    setActionLoading(true);
    try {
      const token = await getToken();
      setAuthToken(token);
      const res = await api.post('/billing/create-portal-session');
      if (res.data.url) window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const isPro = status?.plan === 'PRO';
  const usagePercentage = status ? Math.min(100, (status.usageCount / status.limit) * 100) : 0;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Billing & Usage</h1>
        <p className="text-muted-foreground">Manage your subscription and track your usage.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Usage Card */}
        <Card className="border-2 border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Daily Usage
            </CardTitle>
            <CardDescription>
              {isPro ? 'You have unlimited access.' : 'Refreshes every day at midnight.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-4xl font-bold tabular-nums">
                  {status?.usageCount}
                </span>
                <span className="text-muted-foreground pb-1">
                   / {isPro ? '∞' : status?.limit} actions
                </span>
              </div>
              <Progress value={isPro ? 100 : usagePercentage} className="h-3" />
            </div>
            
            <div className="p-4 bg-secondary/50 rounded-lg text-sm">
              <div className="flex items-center gap-2 font-medium mb-1">
                <Shield className="w-4 h-4 text-primary" />
                Current Plan: <Badge variant={isPro ? "default" : "secondary"}>{status?.plan}</Badge>
              </div>
              <p className="text-muted-foreground">
                {isPro 
                  ? "Thank you for supporting us! You're on the Pro plan." 
                  : "You're on the Free plan. Upgrade to unlock unlimited actions."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade / Manage Card */}
        <Card className={`border-2 ${isPro ? 'border-border' : 'border-primary shadow-lg shadow-primary/10'}`}>
          <CardHeader>
            <CardTitle>{isPro ? 'Manage Subscription' : 'Upgrade to Pro'}</CardTitle>
            <CardDescription>
              {isPro ? 'Update payment method or cancel subscription.' : 'Get unlimited actions and priority support.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isPro && (
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Unlimited Next Actions
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Priority AI Processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Early Access to New Features
                </li>
              </ul>
            )}
          </CardContent>
          <CardFooter>
            {isPro ? (
              <Button onClick={handlePortal} disabled={actionLoading} variant="outline" className="w-full">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Manage Subscription
              </Button>
            ) : (
              <Button onClick={handleUpgrade} disabled={actionLoading} className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-md">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upgrade to Pro - $10/mo
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
