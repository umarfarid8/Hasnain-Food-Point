import { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppFloatButton from './components/layout/WhatsAppFloatButton';
import HeroScene from './features/hero/HeroScene';
import MenuGrid from './features/menu/MenuGrid';
import OwnerStory from './features/about/OwnerStory';
import LocationCard from './features/location/LocationCard';
import AdminPage from './features/admin/AdminPage';

function App() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Isolated Admin Portal Route (Not linked anywhere from customer-facing UI)
  if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
    return <AdminPage />;
  }

  // Customer-Facing Single-Page Landing Experience
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-body selection:bg-accent-primary selection:text-white">
      {/* Sticky Header Navbar */}
      <Navbar />

      {/* Main Single Page Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 space-y-8">
        <HeroScene />
        <MenuGrid />
        <OwnerStory />
        <LocationCard />
      </main>

      {/* Floating Action CTA */}
      <WhatsAppFloatButton />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
