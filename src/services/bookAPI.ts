import { apiRequest } from './api';

export interface Book {
  id: string;
  name: string;
  category_id: string;
  collection_id: string;
  publisher: string;
  launch_date?: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Collection {
  id: string;
  name: string;
}

export const bookAPI = {
  getAll: () => apiRequest('/book'),
  getById: (id: string) => apiRequest(`/book/${id}`),
  create: (data: Partial<Book>) => apiRequest('/book', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: Partial<Book>) => apiRequest(`/book/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => apiRequest(`/book/${id}`, {
    method: 'DELETE'
  }),
  getCategories: () => apiRequest('/book/categories'),
  getCollections: () => apiRequest('/book/collections')
}; 