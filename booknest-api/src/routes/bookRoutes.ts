import { Router, Request, Response } from 'express';
import { supabase } from '../lib/db';
import { validateBook } from '../middleware/validation';

const router = Router();

// Get all books
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .select('*');
    
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
      .select('*')
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
router.post('/', validateBook, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .insert(req.body)
      .select()
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
router.put('/:id', validateBook, async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .update(req.body)
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to update book',
      details: error?.message 
    });
  }
});

export const bookRoutes = router;