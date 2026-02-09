import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import Layout from '@/components/Layout';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';

// Import Pages
import { Dashboard } from '@/pages/Dashboard';
import { Onboarding } from '@/pages/Onboarding';
import { History } from '@/pages/History';
import Billing from '@/pages/Billing';
import { LandingPage } from '@/pages/Landing';

// Access env vars safely
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function Users() {
  const [status, setStatus] = useState<string>('Checking API...');
  const { getToken } = useAuth();

  useEffect(() => {
    async function checkHealth() {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setStatus(`API Online: ${data.timestamp}`);
      } catch {
        setStatus('API Offline');
      }
    }
    checkHealth();
  }, []);

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Users</h2>
      <div className="p-4 border rounded-lg bg-card text-card-foreground shadow-sm">
        <h3 className="font-semibold mb-2">API Health Status</h3>
        <p className="font-mono text-sm">{status}</p>
      </div>
    </div>
  );
}

function ClerkProviderWithRoutes() {
  const navigate = useNavigate();

  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      navigate={(to) => navigate(to)}
    >
      <Routes>
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
        
        {/* Public Landing Page - accessible if not logged in, but we can redirect logged in users to dashboard */}
        {/* For now, let's make /landing public, and / check auth */}
        <Route path="/landing" element={<LandingPage />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="history" element={<History />} />
          <Route path="billing" element={<Billing />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </ClerkProvider>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}
