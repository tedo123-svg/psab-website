import { RouterProvider } from 'react-router';
import { router } from './routes';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { Toaster } from 'sonner';

export default function App() {
  return (
    <AdminProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </LanguageProvider>
    </AdminProvider>
  );
}
