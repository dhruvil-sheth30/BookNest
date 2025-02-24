import { Router, Request, Response } from 'express';
import { supabase } from '../lib/db';
import { validateBook } from '../middleware/validation';

const router = Router();

// Get categories
router.get('/categories', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch categories',
      details: error?.message 
    });
  }
});

// Get collections
router.get('/collections', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('collection')
      .select('*')
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch collections',
      details: error?.message 
    });
  }
});

// Get all books with category and collection info
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .select(`
        *,
        category:category_id (id, name),
        collection:collection_id (id, name)
      `)
      .order('name');

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch books',
      details: error?.message 
    });
  }
});

// Get single book
router.get('/:id', async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .select(`
        *,
        category:category_id (id, name),
        collection:collection_id (id, name)
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch book',
      details: error?.message 
    });
  }
});

// Create book
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .insert({
        name: req.body.name,
        category_id: req.body.category_id,
        collection_id: req.body.collection_id,
        publisher: req.body.publisher,
        launch_date: req.body.launch_date || new Date().toISOString()
      })
      .select(`
        *,
        category:category_id (id, name),
        collection:collection_id (id, name)
      `)
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to create book',
      details: error?.message 
    });
  }
});

// Update book
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('book')
      .update({
        name: req.body.name,
        category_id: req.body.category_id,
        collection_id: req.body.collection_id,
        publisher: req.body.publisher,
        launch_date: req.body.launch_date
      })
      .eq('id', id)
      .select(`
        *,
        category:category_id (id, name),
        collection:collection_id (id, name)
      `)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to update book',
      details: error?.message 
    });
  }
});

// Delete book
router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { error } = await supabase
      .from('book')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to delete book',
      details: error?.message 
    });
  }
});

export const bookRoutes = router;