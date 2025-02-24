const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`http://localhost:3002${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    body: options.body && typeof options.body === 'string' 
      ? options.body 
      : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('API Error:', error);
    throw new Error(`Failed to ${options.method || 'fetch'} ${endpoint.split('/').pop()}`);
  }

  return response.json();
};

// Query API methods
export const queryAPI = {
  getStats: () => apiRequest('/query/stats'),
  getOutstanding: () => apiRequest('/query/outstanding'),
  getTopBorrowed: () => apiRequest('/query/top-borrowed'),
  getNeverBorrowed: () => apiRequest('/query/never-borrowed')
};

// Book API methods
export const bookAPI = {
  getAll: () => apiRequest('/book'),
  getById: (id: string) => apiRequest(`/book/${id}`),
  create: (bookData: any) => apiRequest('/book', { 
    method: 'POST', 
    body: bookData 
  }),
  update: (id: string, bookData: any) => apiRequest(`/book/${id}`, { 
    method: 'PUT', 
    body: bookData 
  }),
  getCategories: () => apiRequest('/book/categories'),
  getCollections: () => apiRequest('/book/collections')
};

// Member API methods
export const memberAPI = {
  getAll: () => apiRequest('/member'),
  getById: (id: string) => apiRequest(`/member/${id}`),
  create: (memberData: any) => apiRequest('/member', { 
    method: 'POST', 
    body: memberData 
  }),
  update: (id: string, memberData: any) => apiRequest(`/member/${id}`, { 
    method: 'PUT', 
    body: memberData 
  })
};

// Issuance API methods
export const issuanceAPI = {
  getAll: () => apiRequest('/issuance'),
  getById: (id: string) => apiRequest(`/issuance/${id}`),
  create: (issuanceData: any) => apiRequest('/issuance', { method: 'POST', body: issuanceData }),
  update: (id: string, issuanceData: any) => apiRequest(`/issuance/${id}`, { method: 'PUT', body: issuanceData })
};