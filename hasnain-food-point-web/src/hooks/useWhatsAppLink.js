import { useMemo, useCallback } from 'react';
import { useSettings } from './useSettings';
import {
  DEFAULT_ORDER_TEMPLATE,
  DEFAULT_GENERAL_MESSAGE,
  DEFAULT_WHATSAPP_RAW,
} from '../lib/constants';
import { openExternalUrl } from '../lib/navigation';

function cleanWhatsAppNumber(number) {
  if (!number) return DEFAULT_WHATSAPP_RAW;
  const digitsOnly = String(number).replace(/\D/g, '');
  if (digitsOnly.startsWith('03') && digitsOnly.length === 11) {
    return '92' + digitsOnly.slice(1);
  }
  return digitsOnly || DEFAULT_WHATSAPP_RAW;
}

export function useWhatsAppLink() {
  const { settings } = useSettings();

  const baseNumber = useMemo(() => {
    return cleanWhatsAppNumber(settings?.whatsAppRawNumber || settings?.whatsAppNumber);
  }, [settings?.whatsAppRawNumber, settings?.whatsAppNumber]);

  const buildWhatsAppLink = useCallback(
    (text = DEFAULT_GENERAL_MESSAGE, overrideNumber = null) => {
      const numberToUse = overrideNumber
        ? cleanWhatsAppNumber(overrideNumber)
        : baseNumber;
      const encodedText = encodeURIComponent(text || '');
      return `https://wa.me/${numberToUse}?text=${encodedText}`;
    },
    [baseNumber]
  );

  const buildItemOrderLink = useCallback(
    (itemName) => {
      const message = DEFAULT_ORDER_TEMPLATE(itemName);
      return buildWhatsAppLink(message);
    },
    [buildWhatsAppLink]
  );

  const openWhatsApp = useCallback(
    (text = DEFAULT_GENERAL_MESSAGE, overrideNumber = null) => {
      const url = buildWhatsAppLink(text, overrideNumber);
      openExternalUrl(url);
    },
    [buildWhatsAppLink]
  );

  return {
    baseNumber,
    displayNumber: settings?.whatsAppNumber || settings?.whatsAppRawNumber || DEFAULT_WHATSAPP_RAW,
    buildWhatsAppLink,
    buildItemOrderLink,
    openWhatsApp,
  };
}
