import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { User, Heart, MessageCircle, Award, CheckCircle2, ChefHat } from 'lucide-react';
import SectionHeading from '../../components/ui/SectionHeading';
import Button from '../../components/ui/Button';
import { useSettings } from '../../hooks/useSettings';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';
import { openExternalUrl } from '../../lib/navigation';

export default function OwnerStory() {
  const { settings } = useSettings();
  const { buildWhatsAppLink } = useWhatsAppLink();
  const [imageError, setImageError] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const ownerPhoto = settings.ownerPhotoUrl || '/assets/images/owner.webp';
  const ownerChatLink = buildWhatsAppLink(
    `Hi ${settings.ownerName || 'Hasnain'}! I wanted to say hello and ask about your food.`
  );

  return (
    <motion.section
      id="about"
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="w-full py-6 sm:py-10 scroll-mt-20"
    >
      <SectionHeading
        badge="Our Story • ہمارے بارے میں"
        icon={Heart}
        title="Meet the Maker"
        subtitle="Fresh, honest food made with love in Sahiwal"
      />

      <div className="relative overflow-hidden bg-gradient-to-b from-bg-surface to-bg-surface/80 border border-border-subtle rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl">
        {/* Subtle background glow */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-accent-secondary/5 blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
          {/* Owner Portrait Container */}
          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="relative flex-shrink-0 group"
          >
            <div className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 rounded-2xl bg-bg-primary border-2 border-accent-secondary/40 p-1 overflow-hidden shadow-2xl transition-transform duration-300 group-hover:scale-102">
              {!imageError ? (
                <img
                  src={ownerPhoto}
                  alt={`${settings.ownerName || 'Hasnain Zafar'} - Owner`}
                  className="w-full h-full object-cover rounded-xl"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    if (e.currentTarget.src.includes('.webp')) {
                      e.currentTarget.src = '/assets/images/owner.jpg';
                    } else if (!e.currentTarget.src.includes('hasnain_owner.jpeg')) {
                      e.currentTarget.src = '/assets/images/hasnain_owner.jpeg';
                    } else {
                      setImageError(true);
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-bg-primary text-accent-secondary/60">
                  <User className="w-16 h-16" />
                </div>
              )}
            </div>

            {/* Verified badge */}
            <div className="absolute -bottom-2 -right-2 bg-bg-surface border border-border-subtle p-2 rounded-full shadow-lg text-accent-secondary flex items-center justify-center">
              <Award className="w-5 h-5 text-accent-secondary" />
            </div>
          </motion.div>

          {/* Owner Bio & Trust Highlights */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-accent-secondary text-xs sm:text-sm font-semibold uppercase tracking-wider mb-1">
                <ChefHat className="w-4 h-4 text-accent-primary" />
                <span>Founder & Chef • حسنین ظفر</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-text-primary">
                {settings.ownerName || 'Hasnain Zafar'}
              </h3>
            </div>

            <blockquote className="text-sm sm:text-base text-text-secondary leading-relaxed font-normal italic border-l-0 md:border-l-2 md:border-accent-primary/40 md:pl-4">
              "{settings.ownerStory ||
                "Hasnain Zafar started Hasnain Food Point right here in Sahiwal with one simple idea — serve fresh, honest food, made the way he'd want to eat it himself. Every plate carries his name, so every plate gets his full attention."}"
            </blockquote>

            {/* Visual Trust Badges for fast non-reading comprehension */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 text-xs sm:text-sm font-medium text-text-primary">
              <div className="flex items-center justify-center md:justify-start gap-2 p-2.5 rounded-xl bg-bg-primary/70 border border-border-subtle">
                <CheckCircle2 className="w-4 h-4 text-whatsapp flex-shrink-0" />
                <span>100% Made to Order • تازہ تیار</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 p-2.5 rounded-xl bg-bg-primary/70 border border-border-subtle">
                <CheckCircle2 className="w-4 h-4 text-whatsapp flex-shrink-0" />
                <span>Fresh Daily Spices • خالص مصالحے</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-2 p-2.5 rounded-xl bg-bg-primary/70 border border-border-subtle">
                <CheckCircle2 className="w-4 h-4 text-whatsapp flex-shrink-0" />
                <span>Sahiwal 94/9-L • ساہیوال</span>
              </div>
            </div>

            {/* Action CTA (44px+ tap target) */}
            <div className="pt-2 flex justify-center md:justify-start">
              <Button
                as="a"
                href={ownerChatLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  openExternalUrl(ownerChatLink);
                }}
                variant="outline"
                size="md"
                icon={MessageCircle}
                className="text-xs sm:text-sm min-h-[44px] cursor-pointer"
              >
                Send a Message to Hasnain
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
