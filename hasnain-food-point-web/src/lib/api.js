const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

async function fetchJson(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 4000);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`API Error ${response.status}: ${errorText || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error(`Request timed out for endpoint: ${endpoint}`);
    }
    throw error;
  }
}

export async function fetchMenu() {
  return fetchJson('/menu');
}

export async function fetchSettings() {
  return fetchJson('/settings');
}
