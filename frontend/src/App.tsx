import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { useAccount } from 'wagmi';

// Lazy load pages for better code splitting
const Landing = lazy(() => import('./pages/Landing').then(m => ({ default: m.Landing })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const AddRecord = lazy(() => import('./pages/AddRecord').then(m => ({ default: m.AddRecord })));
const ViewRecords = lazy(() => import('./pages/ViewRecords').then(m => ({ default: m.ViewRecords })));

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-record"
            element={
              <ProtectedRoute>
                <AddRecord />
              </ProtectedRoute>
            }
          />
          <Route
            path="/records"
            element={
              <ProtectedRoute>
                <ViewRecords />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Layout>
  );
}

export default App;
