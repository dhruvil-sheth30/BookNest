import React from 'react';
import { supabase } from '../lib/supabase';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface IssuanceFormProps {
  issuanceId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function IssuanceForm({ issuanceId, onSuccess, onCancel }: IssuanceFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [books, setBooks] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [formData, setFormData] = React.useState({
    book_id: '',
    member_id: '',
    issue_date: new Date().toISOString().split('T')[0],
    return_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'pending'
  });

  React.useEffect(() => {
    fetchOptions();
    if (issuanceId) {
      fetchIssuance();
    }
  }, [issuanceId]);

  const fetchOptions = async () => {
    try {
      const [booksResponse, membersResponse] = await Promise.all([
        supabase.from('book').select('id, name'),
        supabase.from('member').select('id, name')
      ]);

      if (booksResponse.error) throw booksResponse.error;
      if (membersResponse.error) throw membersResponse.error;

      setBooks(booksResponse.data || []);
      setMembers(membersResponse.data || []);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchIssuance = async () => {
    try {
      const { data, error } = await supabase
        .from('issuance')
        .select('*')
        .eq('id', issuanceId)
        .single();

      if (error) throw error;
      if (data) {
        setFormData({
          book_id: data.book_id,
          member_id: data.member_id,
          issue_date: data.issue_date.split('T')[0],
          return_date: data.return_date.split('T')[0],
          status: data.status
        });
      }
    } catch (error) {
      console.error('Error fetching issuance:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = issuanceId
        ? await supabase.from('issuance').update(formData).eq('id', issuanceId)
        : await supabase.from('issuance').insert(formData);

      if (error) throw error;
      onSuccess();
    } catch (error) {
      console.error('Error saving issuance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Select
        label="Book"
        value={formData.book_id}
        onChange={(e) => setFormData({ ...formData, book_id: e.target.value })}
        required
      >
        <option value="">Select a book</option>
        {books.map((book) => (
          <option key={book.id} value={book.id}>
            {book.name}
          </option>
        ))}
      </Select>

      <Select
        label="Member"
        value={formData.member_id}
        onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
        required
      >
        <option value="">Select a member</option>
        {members.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}
          </option>
        ))}
      </Select>

      <Input
        type="date"
        label="Issue Date"
        value={formData.issue_date}
        onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
        required
      />

      <Input
        type="date"
        label="Return Date"
        value={formData.return_date}
        onChange={(e) => setFormData({ ...formData, return_date: e.target.value })}
        required
      />

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? 'Saving...' : issuanceId ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
} 