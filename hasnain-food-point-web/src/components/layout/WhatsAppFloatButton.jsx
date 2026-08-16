import { MessageCircle } from 'lucide-react';
import { useWhatsAppLink } from '../../hooks/useWhatsAppLink';

export default function WhatsAppFloatButton() {
  const { buildWhatsAppLink, displayNumber } = useWhatsAppLink();
  const waLink = buildWhatsAppLink();

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center group"
      role="complementary"
      aria-label="Direct WhatsApp Order Contact"
    >
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 px-4 py-3 rounded-full bg-whatsapp hover:bg-[#20bd5a] text-white font-bold text-sm shadow-xl shadow-whatsapp/30 hover:shadow-whatsapp/50 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-whatsapp/40 min-h-[48px] min-w-[48px]"
        aria-label={`Order on WhatsApp at ${displayNumber}`}
      >
        {/* Pulsing beacon behind the icon */}
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40"></span>
          <MessageCircle className="w-6 h-6 fill-current relative" />
        </span>
        <span className="hidden sm:inline tracking-tight">Order on WhatsApp</span>
        <span className="sm:hidden font-semibold">Order</span>
      </a>
    </div>
  );
}
