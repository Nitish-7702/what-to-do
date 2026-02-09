import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useEffect, useState } from 'react';

function Dashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      <p className="text-muted-foreground mt-2">Welcome to your new PERN application.</p>
    </div>
  );
}

function Users() {
  const [status, setStatus] = useState<string>('Checking API...');

  useEffect(() => {
    // Note: In development, Vite proxies /api to localhost:3001
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(`API Online: ${data.timestamp}`))
      .catch(() => setStatus('API Offline'));
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="settings" element={<div>Settings Page</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
