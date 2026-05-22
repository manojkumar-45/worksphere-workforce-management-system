const API_BASE_URL = 'http://localhost:8080/api/';

class ApiError extends Error {
  constructor(message, response) {
    super(message);
    this.name = 'ApiError';
    this.response = response;
  }
}

const normalizePath = (path = '') => {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  const trimmedPath = String(path).trim();

  if (!trimmedPath) {
    return API_BASE_URL;
  }

  return trimmedPath.replace(/^\/+/, '').replace(/^api\/+/, '');
};

const buildUrl = (path, params) => {
  const normalizedPath = normalizePath(path);
  const url = /^https?:\/\//i.test(normalizedPath)
    ? new URL(normalizedPath)
    : new URL(normalizedPath, API_BASE_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((item) => url.searchParams.append(key, String(item)));
        return;
      }

      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
};

const parseResponseBody = async (response) => {
  const contentType = response.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return response.json();
  }

  if (contentType.startsWith('text/')) {
    return response.text();
  }

  if (response.status === 204) {
    return null;
  }

  return response.text();
};

const request = async (method, path, options = {}) => {
  const { data, params, headers } = options;
  const token = localStorage.getItem('wms_token');
  const requestHeaders = new Headers(headers || {});

  if (token) {
    requestHeaders.set('Authorization', `Bearer ${token}`);
  }

  const init = {
    method,
    headers: requestHeaders,
  };

  if (data !== undefined) {
    requestHeaders.set('Content-Type', 'application/json');
    init.body = JSON.stringify(data);
  }

  const response = await fetch(buildUrl(path, params), init);
  const responseData = await parseResponseBody(response);
  const wrappedResponse = {
    data: responseData,
    status: response.status,
    headers: response.headers,
  };

  if (!response.ok) {
    const message = responseData?.message || `Request failed with status ${response.status}`;
    throw new ApiError(message, wrappedResponse);
  }

  return wrappedResponse;
};

const api = {
  get(path, options) {
    return request('GET', path, options);
  },
  post(path, data, options = {}) {
    return request('POST', path, { ...options, data });
  },
  put(path, data, options = {}) {
    return request('PUT', path, { ...options, data });
  },
  delete(path, options) {
    return request('DELETE', path, options);
  },
};

export default api;
