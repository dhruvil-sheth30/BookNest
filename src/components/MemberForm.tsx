import React from 'react';
import { supabase } from '../lib/supabase';
import { Input } from './Input';
import { Button } from './Button';

interface MemberFormProps {
  memberId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function MemberForm({ memberId, onSuccess, onCancel }: MemberFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: ''
  });

  React.useEffect(() => {
    if (memberId) {
      fetchMember();
    }
  }, [memberId]);

  const fetchMember = async () => {
    try {
      const { data, error } = await supabase
        .from('member')
        .select('*')
        .eq('id', memberId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          name: data.name,
          email: data.email,
          phone: data.phone
        });
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = memberId
        ? await supabase.from('member').update(formData).eq('id', memberId)
        : await supabase.from('member').insert([{ ...formData }]);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <Input
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <Input
        label="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        required
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : memberId ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
} 