const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}, token) {
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || 'Une erreur est survenue.');
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  get(path, token) {
    return request(path, { method: 'GET' }, token);
  },
  post(path, body, token) {
    const isFormData = body instanceof FormData;
    return request(path, {
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      headers: isFormData ? {} : undefined,
    }, token);
  },
  put(path, body, token) {
    return request(path, { method: 'PUT', body: JSON.stringify(body) }, token);
  },
  patch(path, body, token) {
    return request(path, { method: 'PATCH', body: JSON.stringify(body) }, token);
  },
  delete(path, body, token) {
    return request(path, {
      method: 'DELETE',
      body: body ? JSON.stringify(body) : undefined,
    }, token);
  },
};
