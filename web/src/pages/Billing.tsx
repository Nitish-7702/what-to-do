import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle, Zap } from 'lucide-react';

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
      const res = await fetch('http://localhost:3001/billing/status', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setStatus(await res.json());
      }
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
      const res = await fetch('http://localhost:3001/billing/create-checkout-session', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
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
      const res = await fetch('http://localhost:3001/billing/create-portal-session', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Billing & Usage</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Usage Card */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-4xl font-bold">
              {status?.usageCount} <span className="text-lg text-gray-500 font-normal">/ {status?.limit} actions</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600" 
                style={{ width: `${Math.min(100, ((status?.usageCount || 0) / (status?.limit || 1)) * 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {status?.plan === 'FREE' 
                ? 'Upgrade to Pro for unlimited actions.' 
                : 'You have unlimited access!'}
            </p>
          </CardContent>
        </Card>

        {/* Plan Card */}
        <Card className={status?.plan === 'PRO' ? 'border-blue-500 border-2' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {status?.plan === 'PRO' ? <Zap className="text-yellow-500" /> : null}
              Current Plan: {status?.plan}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                {status?.plan === 'PRO' ? 'Unlimited Next Actions' : '5 Next Actions per day'}
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Next Action Engine
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                History & Feedback
              </li>
            </ul>

            {status?.plan === 'FREE' ? (
              <Button onClick={handleUpgrade} disabled={actionLoading} className="w-full">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upgrade to Pro
              </Button>
            ) : (
              <Button onClick={handlePortal} variant="outline" disabled={actionLoading} className="w-full">
                {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Manage Subscription
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
