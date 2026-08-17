import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, MessageCircle, Clock, Menu as MenuIcon, X } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';
import { NAV_LINKS, SHOP_NAME } from '../../lib/constants';

export default function Navbar() {
  const { settings } = useSettings();
  const { buildWhatsAppLink } = useWhatsAppLink();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const waLink = buildWhatsAppLink();

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-bg-surface/90 backdrop-blur-md shadow-lg border-b border-border-subtle'
          : 'bg-bg-surface/75 backdrop-blur-sm border-b border-border-subtle/50'
      }`}
    >
      <div className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Logo / Name */}
        <a
          href="#hero"
          className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded-lg"
          aria-label={settings.name || SHOP_NAME}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-md shadow-accent-primary/20 group-hover:scale-105 transition-transform">
            <Flame className="w-6 h-6 text-bg-primary" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading font-bold text-lg sm:text-xl text-text-primary tracking-tight leading-tight group-hover:text-accent-secondary transition-colors">
              {settings.name || SHOP_NAME}
            </span>
            <span className="text-[11px] sm:text-xs text-text-secondary flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-accent-secondary" />
              <span>{settings.openingHours || '12:00 PM – 9:00 PM'}</span>
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-text-secondary hover:text-text-primary font-medium text-sm transition-colors py-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary rounded"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button & Mobile Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-whatsapp hover:bg-[#20bd5a] text-white text-sm font-semibold flex items-center gap-2 shadow-md shadow-whatsapp/20 active:scale-[0.98] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-whatsapp"
            aria-label="Order on WhatsApp"
          >
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
            <span className="hidden sm:inline">Order on WhatsApp</span>
            <span className="sm:hidden">Order</span>
          </a>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl bg-bg-surface border border-border-subtle text-text-secondary hover:text-text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary"
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden bg-bg-surface border-b border-border-subtle px-4 py-3 space-y-2 overflow-hidden"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-medium text-text-secondary hover:text-text-primary hover:bg-bg-primary/50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
