import { Flame, MessageCircle, MapPin, Clock, Phone, ArrowUp } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';
import { NAV_LINKS, SHOP_NAME } from '../../lib/constants';
import { openExternalUrl, scrollToSection } from '../../lib/navigation';

export default function Footer() {
  const { settings } = useSettings();
  const { buildWhatsAppLink, displayNumber } = useWhatsAppLink();

  const waLink = buildWhatsAppLink();

  return (
    <footer className="w-full bg-bg-surface border-t border-border-subtle mt-16">
      <div className="w-full max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                <Flame className="w-5 h-5 text-bg-primary" />
              </div>
              <span className="font-heading font-bold text-xl text-text-primary">
                {settings.name || SHOP_NAME}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {settings.tagline || 'Fresh & Honest Food in Sahiwal — made fresh to order daily.'}
            </p>
            <div className="pt-2">
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  openExternalUrl(waLink);
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-whatsapp hover:bg-[#20bd5a] text-white text-sm font-semibold shadow-md shadow-whatsapp/20 transition-all min-h-[44px] cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Order on WhatsApp ({displayNumber})</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-base text-text-primary tracking-wide uppercase text-xs text-accent-secondary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => scrollToSection(link.href, e)}
                    className="inline-block py-1 text-sm text-text-secondary hover:text-accent-secondary transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="space-y-3">
            <h3 className="font-heading font-bold text-base text-text-primary tracking-wide uppercase text-xs text-accent-secondary">
              Visit Us
            </h3>
            <div className="space-y-2.5 text-sm text-text-secondary">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-accent-primary flex-shrink-0 mt-0.5" />
                <span>{settings.address || '94/9-L, Sahiwal'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-accent-secondary flex-shrink-0 mt-0.5" />
                <span>{settings.openingHours || '12:00 PM – 9:00 PM, Daily'}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-whatsapp flex-shrink-0 mt-0.5" />
                <span>{displayNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-6 border-t border-border-subtle/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-secondary">
          <p>© {new Date().getFullYear()} {settings.name || SHOP_NAME}. All rights reserved.</p>
          <button
            type="button"
            onClick={(e) => scrollToSection('hero', e)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-bg-primary hover:bg-bg-primary/80 text-text-secondary hover:text-text-primary border border-border-subtle transition-colors min-h-[44px] cursor-pointer"
            aria-label="Scroll to top of page"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
