import React from 'react';
import { supabase } from '../lib/supabase';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';

interface BookFormProps {
  bookId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function BookForm({ bookId, onSuccess, onCancel }: BookFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [categories, setCategories] = React.useState([]);
  const [collections, setCollections] = React.useState([]);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  
  const [formData, setFormData] = React.useState({
    name: '',
    category_id: '',
    collection_id: '',
    publisher: '',
    launch_date: '',
  });

  React.useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, collectionsRes] = await Promise.all([
          supabase.from('category').select('id, name').order('name'),
          supabase.from('collection').select('id, name').order('name'),
        ]);

        if (categoriesRes.error) throw categoriesRes.error;
        if (collectionsRes.error) throw collectionsRes.error;

        setCategories(categoriesRes.data || []);
        setCollections(collectionsRes.data || []);

        if (bookId) {
          const { data, error } = await supabase
            .from('book')
            .select('*')
            .eq('id', bookId)
            .single();

          if (error) throw error;
          if (data) {
            setFormData({
              name: data.name,
              category_id: data.category_id,
              collection_id: data.collection_id,
              publisher: data.publisher || '',
              launch_date: data.launch_date || '',
            });
          }
        }
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    }

    fetchData();
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { name, category_id, collection_id, publisher, launch_date } = formData;
      
      // Validation
      const newErrors: Record<string, string> = {};
      if (!name.trim()) newErrors.name = 'Name is required';
      if (!category_id) newErrors.category_id = 'Category is required';
      if (!collection_id) newErrors.collection_id = 'Collection is required';
      
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const bookData = {
        name,
        category_id,
        collection_id,
        publisher: publisher || null,
        launch_date: launch_date || null,
      };

      if (bookId) {
        const { error } = await supabase
          .from('book')
          .update(bookData)
          .eq('id', bookId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('book')
          .insert([bookData]);
        if (error) throw error;
      }

      onSuccess();
    } catch (error) {
      console.error('Error saving book:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        value={formData.name}
        onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
        error={errors.name}
        required
      />
      
      <Select
        label="Category"
        value={formData.category_id}
        onChange={e => setFormData(prev => ({ ...prev, category_id: e.target.value }))}
        options={categories.map(cat => ({ value: cat.id, label: cat.name }))}
        error={errors.category_id}
        required
      />
      
      <Select
        label="Collection"
        value={formData.collection_id}
        onChange={e => setFormData(prev => ({ ...prev, collection_id: e.target.value }))}
        options={collections.map(col => ({ value: col.id, label: col.name }))}
        error={errors.collection_id}
        required
      />
      
      <Input
        label="Publisher"
        value={formData.publisher}
        onChange={e => setFormData(prev => ({ ...prev, publisher: e.target.value }))}
      />
      
      <Input
        type="date"
        label="Launch Date"
        value={formData.launch_date}
        onChange={e => setFormData(prev => ({ ...prev, launch_date: e.target.value }))}
      />

      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={onCancel} type="button">
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {bookId ? 'Update' : 'Create'} Book
        </Button>
      </div>
    </form>
  );
} 