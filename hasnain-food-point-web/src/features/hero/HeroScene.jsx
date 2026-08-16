import { useState } from 'react';
import { Sparkles, MessageCircle, Flame, Clock, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';
import Button from '../../components/ui/Button';

export default function HeroScene() {
  const { settings } = useSettings();
  const { buildWhatsAppLink } = useWhatsAppLink();
  const waLink = buildWhatsAppLink();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section
      id="hero"
      className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-b from-bg-surface/95 via-bg-surface/60 to-bg-primary/95 border border-border-subtle p-5 sm:p-8 md:p-10 my-2 sm:my-4 shadow-2xl"
    >
      {/* Background Decorative Ember Glows */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent-primary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-accent-secondary/10 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-primary/15 border border-accent-primary/30 text-accent-secondary text-xs sm:text-sm font-semibold mb-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
          <span>Freshly Made to Order in Sahiwal</span>
        </div>

        {/* H1 Shop Title */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-text-primary tracking-tight max-w-3xl leading-[1.15]">
          {settings.name || 'Hasnain Food Point'}
        </h1>

        {/* Urdu & English Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-text-secondary mt-3 max-w-xl font-normal leading-relaxed">
          {settings.tagline || 'Crispy fries, juicy burgers, hot samosas & rolls made with real passion.'}
        </p>

        {/* Food Visual Showcase (Static Hero Version — TODO: Spline 3D Scene in Phase 4) */}
        <div className="relative my-6 sm:my-8 w-full max-w-lg group">
          <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-bg-surface/80 aspect-[16/9] shadow-xl">
            {/* Loading placeholder skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-bg-surface animate-pulse flex items-center justify-center">
                <Flame className="w-10 h-10 text-accent-primary/40 animate-bounce" />
              </div>
            )}

            <img
              src="/assets/images/hero-food.webp"
              alt="Delicious fast food showcase at Hasnain Food Point"
              className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.target.src = '/assets/images/hero-food.jpg';
                setImageLoaded(true);
              }}
            />

            {/* Gradient Overlay for Text Legibility & Depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-transparent to-black/30 pointer-events-none" />

            {/* Floating Highlight Badges on the Hero Image */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-1.5 bg-bg-surface/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-border-subtle text-xs font-semibold text-text-primary shadow-md">
                <Flame className="w-3.5 h-3.5 text-accent-primary" />
                <span>100% Hot & Fresh</span>
              </div>
              <div className="flex items-center gap-1.5 bg-whatsapp/20 backdrop-blur-md px-2.5 py-1 rounded-lg border border-whatsapp/40 text-xs font-semibold text-whatsapp shadow-md">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Order on WhatsApp</span>
              </div>
            </div>
          </div>

          {/* Ember ambient glow under the image card */}
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-accent-primary/20 via-accent-secondary/20 to-accent-primary/20 -z-10 blur-xl opacity-70" />
        </div>

        {/* Primary Action Buttons (44px+ tap target, icon + label) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
          <Button
            as="a"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            icon={MessageCircle}
            className="w-full sm:w-auto shadow-lg shadow-whatsapp/20 text-base font-bold"
          >
            Order on WhatsApp
          </Button>
          <Button
            as="a"
            href="#menu"
            variant="outline"
            size="lg"
            icon={ChevronDown}
            className="w-full sm:w-auto text-base"
          >
            View Menu
          </Button>
        </div>

        {/* Quick Highlights Bar for Low-Literacy / Fast Scanning */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 mt-8 pt-6 border-t border-border-subtle/80 w-full max-w-2xl text-xs sm:text-sm">
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-bg-surface/40 border border-border-subtle/50 text-text-secondary">
            <Clock className="w-4 h-4 text-accent-secondary flex-shrink-0" />
            <span className="truncate">{settings.openingHours || '12:00 PM – 9:00 PM'}</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2 rounded-xl bg-bg-surface/40 border border-border-subtle/50 text-text-secondary">
            <MapPin className="w-4 h-4 text-accent-primary flex-shrink-0" />
            <span className="truncate">{settings.address || '94/9-L, Sahiwal'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-2 rounded-xl bg-bg-surface/40 border border-border-subtle/50 text-text-secondary">
            <MessageCircle className="w-4 h-4 text-whatsapp flex-shrink-0" />
            <span>Fast Chat Response</span>
          </div>
        </div>
      </div>
    </section>
  );
}
