import { MapPin, Clock, Navigation, MessageCircle, Sparkles } from 'lucide-react';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';
import { useSettings } from '../../hooks/useSettings';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';

export default function LocationCard() {
  const { settings } = useSettings();
  const { buildWhatsAppLink, displayNumber } = useWhatsAppLink();
  const waLink = buildWhatsAppLink(
    'Hi! I would like to ask about directions or pickup at Hasnain Food Point.'
  );

  // TODO: Update with client's exact Google Maps pin coordinates when provided
  const address = settings.address || '94/9-L, Sahiwal';
  const openingHours = settings.openingHours || '12:00 PM – 9:00 PM, Daily';
  const mapLink =
    settings.mapUrl ||
    `https://maps.google.com/?q=${encodeURIComponent(address)}`;

  return (
    <section id="location" className="w-full py-6 sm:py-10 scroll-mt-20">
      <SectionHeading
        badge="Visit Us"
        icon={MapPin}
        title="Location & Timings"
        subtitle="Stop by our food point in Sahiwal for hot takeout or order ahead on WhatsApp"
      />

      <div className="bg-gradient-to-b from-bg-surface to-bg-surface/90 border border-border-subtle rounded-3xl p-5 sm:p-8 md:p-10 shadow-xl space-y-6 sm:space-y-8">
        {/* Info Grid (Address & Hours) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Address Box */}
          <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-bg-primary/80 border border-border-subtle hover:border-accent-primary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center flex-shrink-0 text-accent-primary shadow-sm">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-text-secondary">
                Our Location
              </span>
              <p className="font-heading font-bold text-base sm:text-lg text-text-primary mt-0.5">
                {address}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Sahiwal, Punjab, Pakistan
              </p>
            </div>
          </div>

          {/* Opening Hours Box */}
          <div className="flex items-start gap-4 p-4 sm:p-5 rounded-2xl bg-bg-primary/80 border border-border-subtle hover:border-accent-secondary/40 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-accent-secondary/15 border border-accent-secondary/30 flex items-center justify-center flex-shrink-0 text-accent-secondary shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-heading font-semibold uppercase tracking-wider text-text-secondary">
                Opening Hours
              </span>
              <p className="font-heading font-bold text-base sm:text-lg text-text-primary mt-0.5">
                {openingHours}
              </p>
              <p className="text-xs text-text-secondary mt-1">
                Open 7 Days a Week
              </p>
            </div>
          </div>
        </div>

        {/* Visual Map Representation Card */}
        <div className="relative rounded-2xl overflow-hidden border border-border-subtle bg-bg-primary p-6 sm:p-8 flex flex-col items-center justify-center text-center group">
          {/* Subtle Grid Map Effect */}
          <div
            className="absolute inset-0 opacity-15 bg-[radial-gradient(#F4B93E_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 space-y-3 max-w-md">
            <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 border border-accent-primary/40 mx-auto flex items-center justify-center text-accent-primary shadow-lg group-hover:scale-110 transition-transform">
              <MapPin className="w-7 h-7 animate-bounce" />
            </div>

            <h4 className="text-lg sm:text-xl font-heading font-bold text-text-primary">
              Serving Fresh Food in Sahiwal
            </h4>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              Find us at <span className="text-accent-secondary font-medium">{address}</span>. Tap below to navigate directly using Google Maps.
            </p>

            <div className="pt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-xs text-text-secondary">
              <Sparkles className="w-3.5 h-3.5 text-accent-secondary" />
              <span>Easy Pickup & Fast Preparation</span>
            </div>
          </div>
        </div>

        {/* Action Buttons (Directions + WhatsApp) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <Button
            as="a"
            href={mapLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="lg"
            icon={Navigation}
            className="w-full sm:w-auto font-semibold"
          >
            Get Directions in Maps
          </Button>

          <Button
            as="a"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            icon={MessageCircle}
            className="w-full sm:w-auto font-semibold shadow-lg shadow-whatsapp/20"
          >
            Ask on WhatsApp ({displayNumber})
          </Button>
        </div>
      </div>
    </section>
  );
}
