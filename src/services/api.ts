import { API_URL } from '../config';

interface ApiConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
}

export const apiRequest = async (endpoint: string, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw error;
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