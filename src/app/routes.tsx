import { createBrowserRouter } from 'react-router';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Services } from './pages/Services';
import { News } from './pages/News';
import { Projects } from './pages/Projects';
import { Resources } from './pages/Resources';
import { Community } from './pages/Community';
import { Contact } from './pages/Contact';
import { NotFound } from './pages/NotFound';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Outlet } from 'react-router';
import { AdminLogin } from './admin/AdminLogin';
import { AdminLayout } from './admin/AdminLayout';
import { AdminGuard } from './admin/AdminGuard';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { AdminNews } from './admin/pages/AdminNews';
import { AdminServices } from './admin/pages/AdminServices';
import { AdminProjects } from './admin/pages/AdminProjects';
import { AdminResources } from './admin/pages/AdminResources';
import { AdminMessages } from './admin/pages/AdminMessages';

function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'services', Component: Services },
      { path: 'news', Component: News },
      { path: 'projects', Component: Projects },
      { path: 'resources', Component: Resources },
      { path: 'community', Component: Community },
      { path: 'contact', Component: Contact },
      { path: '*', Component: NotFound },
    ],
  },
  {
    path: '/admin/login',
    Component: AdminLogin,
  },
  {
    path: '/admin',
    Component: AdminGuard,
    children: [
      {
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: 'news', Component: AdminNews },
          { path: 'services', Component: AdminServices },
          { path: 'projects', Component: AdminProjects },
          { path: 'resources', Component: AdminResources },
          { path: 'messages', Component: AdminMessages },
        ],
      },
    ],
  },
]);
