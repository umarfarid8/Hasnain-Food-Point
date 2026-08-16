import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppFloatButton from './components/layout/WhatsAppFloatButton';
import HeroScene from './features/hero/HeroScene';
import MenuGrid from './features/menu/MenuGrid';
import OwnerStory from './features/about/OwnerStory';
import LocationCard from './features/location/LocationCard';

function App() {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col font-body">
      <Navbar />
      <main className="flex-1 w-full max-w-md mx-auto px-4 py-4 sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
        <HeroScene />
        <MenuGrid />
        <OwnerStory />
        <LocationCard />
      </main>
      <WhatsAppFloatButton />
      <Footer />
    </div>
  );
}

export default App;
