import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { MessageCircle, Utensils, Flame } from 'lucide-react';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';

export default function MenuItemCard({ item, index = 0 }) {
  const { buildItemOrderLink } = useWhatsAppLink();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  if (!item) return null;

  const orderLink = buildItemOrderLink(item.name);
  const displayPrice =
    item.priceDisplay ||
    (item.price && Number(item.price) > 0 ? `Rs. ${item.price}` : 'Ask on WhatsApp');

  const imageUrl = item.imageUrl || `/assets/images/${item.name.toLowerCase().replace(/\s+/g, '-')}.webp`;

  return (
    <motion.div
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.3,
        delay: shouldReduceMotion ? 0 : Math.min(index * 0.05, 0.25),
        ease: 'easeOut',
      }}
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      className="group relative bg-bg-surface/90 hover:bg-bg-surface border border-border-subtle hover:border-accent-primary/50 transition-colors duration-300 rounded-2xl overflow-hidden flex flex-col justify-between shadow-md hover:shadow-xl hover:shadow-accent-primary/5"
    >
      {/* Top Image Hero Area (Photography-led per PRD §3 & design.md §4) */}
      <div className="relative w-full aspect-[16/10] bg-bg-primary overflow-hidden">
        {!imageError ? (
          <>
            {/* Loading placeholder skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-bg-surface animate-pulse flex items-center justify-center">
                <Utensils className="w-8 h-8 text-accent-secondary/30" />
              </div>
            )}
            <img
              src={imageUrl}
              alt={`${item.name} at Hasnain Food Point`}
              loading="lazy"
              decoding="async"
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                // Fallback attempt: if .webp failed, try .jpg or fallback icon
                if (imageUrl.endsWith('.webp')) {
                  const jpgUrl = imageUrl.replace('.webp', '.jpg');
                  if (jpgUrl !== imageUrl) {
                    const img = new Image();
                    img.onload = () => {
                      setImageLoaded(true);
                    };
                    img.onerror = () => setImageError(true);
                    img.src = jpgUrl;
                    return;
                  }
                }
                setImageError(true);
              }}
            />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-bg-primary/90 text-accent-secondary/60 p-4">
            <Utensils className="w-10 h-10 mb-1" />
            <span className="text-xs text-text-secondary">Freshly Prepared • تازہ تیار</span>
          </div>
        )}

        {/* Subtle Gradient overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-surface via-transparent to-black/20 pointer-events-none" />

        {/* Floating Price Tag on Image (Top Right) */}
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-xl bg-bg-primary/95 backdrop-blur-md border border-accent-secondary/40 font-heading font-bold text-sm sm:text-base text-accent-secondary shadow-lg tabular-nums">
            {displayPrice}
          </span>
        </div>

        {/* Freshly Made Badge (Top Left) */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-bg-surface/90 backdrop-blur-md border border-border-subtle text-xs font-semibold text-text-primary">
            <Flame className="w-3.5 h-3.5 text-accent-primary" />
            <span>Hot & Fresh</span>
          </span>
        </div>
      </div>

      {/* Card Content & Order Action */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-1 gap-3">
        <div>
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h4 className="font-heading font-bold text-base sm:text-lg text-text-primary group-hover:text-accent-secondary transition-colors">
              {item.name}
            </h4>
            {item.urduName && (
              <span className="text-xs sm:text-sm font-semibold text-accent-secondary/90 px-2 py-0.5 rounded-md bg-bg-primary/60 border border-border-subtle">
                {item.urduName}
              </span>
            )}
          </div>

          {item.description && (
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          )}
        </div>

        {/* Bottom Bar: Price & Primary WhatsApp Order Button (44px+ tap target) */}
        <div className="pt-3 border-t border-border-subtle/60 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xs text-text-secondary font-medium">Fresh to order</span>
            <span className="text-sm font-bold text-accent-secondary sm:hidden tabular-nums">
              {displayPrice}
            </span>
          </div>

          <motion.a
            whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
            whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
            href={orderLink}
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-4 py-2.5 rounded-xl bg-whatsapp hover:bg-[#20bd5a] text-white font-heading font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-whatsapp/25 hover:shadow-whatsapp/40"
            aria-label={`Order ${item.name} on WhatsApp`}
          >
            <MessageCircle className="w-4 h-4 fill-current flex-shrink-0" />
            <span>Order on WhatsApp</span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
