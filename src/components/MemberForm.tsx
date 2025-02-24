import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { memberAPI } from '../services/api';
import { Select } from './Select';

interface MemberFormProps {
  memberId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MemberForm({ memberId, onSuccess, onCancel }: MemberFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    membership_status: 'active'
  });

  const fetchMember = async () => {
    try {
      const data = await memberAPI.getById(memberId);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone,
        membership_status: data.membership?.[0]?.status || 'inactive'
      });
    } catch (err) {
      console.error('Error fetching member:', err);
      setError('Failed to load member details');
    }
  };

  React.useEffect(() => {
    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (memberId) {
        await memberAPI.update(memberId, formData);
      } else {
        await memberAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      console.error('Error saving member:', err);
      setError(err.details || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {memberId ? 'Edit Member' : 'Add New Member'}
        </h3>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <Input
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          
          <Select
            label="Membership Status"
            value={formData.membership_status}
            onChange={(e) => setFormData({ ...formData, membership_status: e.target.value })}
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </div>
      </div>

      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <Button
          type="submit"
          disabled={loading}
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
} 