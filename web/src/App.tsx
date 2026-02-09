import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import Layout from '@/components/Layout';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect, useState } from 'react';

// Access env vars safely
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground mt-2">Welcome to your new PERN application.</p>
    </div>
  );
}

function Onboarding() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Onboarding</h2>
      <p className="text-muted-foreground mt-2">Get started here.</p>
    </div>
  );
}

function History() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">History</h2>
      <p className="text-muted-foreground mt-2">View your past actions.</p>
    </div>
  );
}

function Users() {
  const [status, setStatus] = useState<string>('Checking API...');
  const { getToken } = useAuth();

  useEffect(() => {
    async function checkHealth() {
      try {
        // Example of public endpoint
        const res = await fetch('/api/health');
        const data = await res.json();
        setStatus(`API Online: ${data.timestamp}`);
      } catch {
        setStatus('API Offline');
      }
    }
    checkHealth();
  }, []);

  useEffect(() => {
     async function checkMe() {
         try {
             const token = await getToken();
             const res = await fetch('/api/me', {
                 headers: {
                     Authorization: `Bearer ${token}`
                 }
             });
             const data = await res.json();
             console.log('User data:', data);
         } catch (e) {
             console.error(e);
         }
     }
     checkMe();
  }, [getToken]);

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
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="history" element={<History />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </ClerkProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ClerkProviderWithRoutes />
    </BrowserRouter>
  );
}

export default App;
