import { apiRequest } from './api';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  membership_status?: string;
}

export const memberAPI = {
  getAll: () => apiRequest('/member'),
  getById: (id: string) => apiRequest(`/member/${id}`),
  create: (data: any) => apiRequest('/member', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  update: (id: string, data: any) => apiRequest(`/member/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  delete: (id: string) => apiRequest(`/member/${id}`, {
    method: 'DELETE'
  })
}; 