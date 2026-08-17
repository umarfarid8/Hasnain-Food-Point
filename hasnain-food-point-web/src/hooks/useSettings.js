import { useState, useEffect, useCallback } from 'react';
import { fetchSettings } from '../lib/api';
import {
  SHOP_NAME,
  SHOP_TAGLINE,
  DEFAULT_WHATSAPP_NUMBER,
  DEFAULT_WHATSAPP_RAW,
  DEFAULT_ADDRESS,
  DEFAULT_OPENING_HOURS,
  DEFAULT_MAP_URL,
  DEFAULT_OWNER_NAME,
  DEFAULT_OWNER_STORY,
} from '../lib/constants';

const fallbackSettings = {
  name: SHOP_NAME,
  tagline: SHOP_TAGLINE,
  whatsAppNumber: DEFAULT_WHATSAPP_NUMBER,
  whatsAppRawNumber: DEFAULT_WHATSAPP_RAW,
  address: DEFAULT_ADDRESS,
  openingHours: DEFAULT_OPENING_HOURS,
  mapUrl: DEFAULT_MAP_URL,
  ownerName: DEFAULT_OWNER_NAME,
  ownerStory: DEFAULT_OWNER_STORY,
  ownerPhotoUrl: null,
};

export function useSettings() {
  const [settings, setSettings] = useState(fallbackSettings);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSettings();
      if (data) {
        setSettings({
          ...fallbackSettings,
          ...data,
        });
      }
    } catch (err) {
      console.warn('Failed to load settings from API, using fallback defaults:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const data = await fetchSettings();
        if (isMounted && data) {
          setSettings({
            ...fallbackSettings,
            ...data,
          });
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          console.warn('Failed to load settings from API, using fallback defaults:', err);
          setError(err);
          setLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  return { settings, loading, error, refetch: loadSettings };
}
