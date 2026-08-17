import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, MessageCircle, Clock, MapPin, ChevronDown } from 'lucide-react';
import { useSettings } from '../../hooks/useSettings';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';
import Button from '../../components/ui/Button';
import SplineHero from './SplineHero';

export default function HeroScene() {
  const { settings } = useSettings();
  const { buildWhatsAppLink } = useWhatsAppLink();
  const waLink = buildWhatsAppLink();
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: 'easeOut' },
    },
  };

  return (
    <motion.section
      id="hero"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
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
        <motion.div
          variants={itemVariants}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-primary/15 border border-accent-primary/30 text-accent-secondary text-xs sm:text-sm font-semibold mb-3 shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-accent-primary animate-pulse" />
          <span>Fresh Food in Sahiwal • تازہ کھانا</span>
        </motion.div>

        {/* H1 Shop Title */}
        <motion.h1
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-6xl font-heading font-extrabold text-text-primary tracking-tight max-w-3xl leading-[1.15]"
        >
          {settings.name || 'Hasnain Food Point'}
        </motion.h1>

        {/* Subtitle - Short and punchy */}
        <motion.p
          variants={itemVariants}
          className="text-sm sm:text-base md:text-lg text-text-secondary mt-2 max-w-xl font-normal leading-relaxed"
        >
          {settings.tagline || 'Crispy fries, hot burgers, samosas & rolls made fresh to order.'}
        </motion.p>

        {/* 3D Spline Interactive Showcase & Static Fallback */}
        <motion.div variants={itemVariants} className="w-full">
          <SplineHero />
        </motion.div>

        {/* Primary Action Buttons (44px+ tap target, icon + label) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3.5 w-full sm:w-auto"
        >
          <Button
            as="a"
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            icon={MessageCircle}
            className="w-full sm:w-auto shadow-lg shadow-whatsapp/25 text-base font-bold min-h-[48px]"
          >
            Order on WhatsApp
          </Button>
          <Button
            as="a"
            href="#menu"
            variant="outline"
            size="lg"
            icon={ChevronDown}
            className="w-full sm:w-auto text-base min-h-[48px]"
          >
            View Menu • مینو دیکھیں
          </Button>
        </motion.div>

        {/* Quick Highlights Bar for Low-Literacy / Fast Scanning */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-4 mt-8 pt-6 border-t border-border-subtle/80 w-full max-w-2xl text-xs sm:text-sm"
        >
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-bg-surface/50 border border-border-subtle text-text-secondary">
            <Clock className="w-4 h-4 text-accent-secondary flex-shrink-0" />
            <span className="truncate">{settings.openingHours || '12:00 PM – 9:00 PM'}</span>
          </div>
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-bg-surface/50 border border-border-subtle text-text-secondary">
            <MapPin className="w-4 h-4 text-accent-primary flex-shrink-0" />
            <span className="truncate">{settings.address || '94/9-L, Sahiwal'}</span>
          </div>
          <div className="col-span-2 sm:col-span-1 flex items-center justify-center gap-2 p-2.5 rounded-xl bg-bg-surface/50 border border-border-subtle text-text-secondary">
            <MessageCircle className="w-4 h-4 text-whatsapp flex-shrink-0" />
            <span>Direct WhatsApp Chat</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
