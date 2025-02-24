import { Router, Request, Response } from 'express';
import { supabase } from '../lib/db';

const router = Router();

// Never borrowed books
router.get('/never-borrowed', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('book')
      .select('name, publisher')
      .not('id', 'in', (
        supabase
          .from('issuance')
          .select('book_id')
      ));
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch never borrowed books',
      details: error?.message 
    });
  }
});

// Outstanding books
router.get('/outstanding', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('issuance')
      .select(`
        member:member_id (name),
        book:book_id (name, publisher),
        issue_date,
        return_date
      `)
      .eq('status', 'pending')
      .order('return_date');
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch outstanding books',
      details: error?.message 
    });
  }
});

// Most borrowed books
router.get('/most-borrowed', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .rpc('get_most_borrowed_books')
      .limit(10);
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch most borrowed books',
      details: error?.message 
    });
  }
});

export const queryRoutes = router; 