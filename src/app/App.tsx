import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider, useAdmin } from './contexts/AdminContext';
import { Toaster } from 'sonner';

function AppInner() {
  const { loading } = useAdmin();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }
  return <RouterProvider router={router} />;
}

export default function App() {
  return (
    <AdminProvider>
      <LanguageProvider>
        <AppInner />
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </AdminProvider>
  );
}
