export function useWhatsAppLink() {
  const buildWhatsAppLink = (number, text) => {
    const cleanNumber = number?.replace(/\D/g, '') || '';
    const encodedText = encodeURIComponent(text || '');
    return `https://wa.me/${cleanNumber}?text=${encodedText}`;
  };

  return { buildWhatsAppLink };
}
