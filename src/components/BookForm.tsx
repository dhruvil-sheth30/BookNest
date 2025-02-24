import React from 'react';
import { Input } from './Input';
import { Button } from './Button';
import { Select } from './Select';
import { bookAPI } from '../services/bookAPI';

interface BookFormProps {
  bookId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

interface Category {
  id: string;
  name: string;
}

interface Collection {
  id: string;
  name: string;
}

export function BookForm({ bookId, onSuccess, onCancel }: BookFormProps) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [formData, setFormData] = React.useState({
    name: '',
    category_id: '',
    collection_id: '',
    publisher: ''
  });

  const fetchOptions = async () => {
    try {
      const [categoriesData, collectionsData] = await Promise.all([
        bookAPI.getCategories(),
        bookAPI.getCollections()
      ]);
      setCategories(categoriesData || []);
      setCollections(collectionsData || []);
    } catch (err) {
      console.error('Error fetching options:', err);
      setError('Failed to load categories and collections');
    }
  };

  const fetchBook = async () => {
    if (!bookId) return;
    try {
      const data = await bookAPI.getById(bookId);
      if (data) {
        setFormData({
          name: data.name,
          category_id: data.category_id || '',
          collection_id: data.collection_id || '',
          publisher: data.publisher || ''
        });
      }
    } catch (err) {
      console.error('Error fetching book:', err);
      setError('Failed to load book details');
    }
  };

  React.useEffect(() => {
    fetchOptions();
    if (bookId) {
      fetchBook();
    }
  }, [bookId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      if (bookId) {
        await bookAPI.update(bookId, formData);
      } else {
        await bookAPI.create(formData);
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving book:', err);
      setError('Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          {bookId ? 'Edit Book' : 'Add New Book'}
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
          
          <Select
            label="Category"
            value={formData.category_id}
            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          
          <Select
            label="Collection"
            value={formData.collection_id}
            onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
            required
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select a collection</option>
            {collections.map((collection) => (
              <option key={collection.id} value={collection.id}>
                {collection.name}
              </option>
            ))}
          </Select>
          
          <Input
            label="Publisher"
            value={formData.publisher}
            onChange={(e) => setFormData({ ...formData, publisher: e.target.value })}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
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