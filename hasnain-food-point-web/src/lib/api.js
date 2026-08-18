const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

async function fetchJson(endpoint, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);

  try {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (options.token) {
      headers.Authorization = `Bearer ${options.token}`;
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      let errorMessage = response.statusText;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson.message || JSON.stringify(errorJson);
      } catch {
        const errorText = await response.text().catch(() => '');
        if (errorText) errorMessage = errorText;
      }
      const err = new Error(errorMessage || `API Error ${response.status}`);
      err.status = response.status;
      throw err;
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

// Admin API Endpoints
export async function adminLogin(password) {
  return fetchJson('/admin/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}

export async function fetchAdminMenuItems(token) {
  return fetchJson('/admin/menu-items', {
    method: 'GET',
    token,
  });
}

export async function updateAdminMenuItem(id, { price, isAvailable }, token) {
  return fetchJson(`/admin/menu-items/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify({ price: Number(price), isAvailable: Boolean(isAvailable) }),
  });
}
