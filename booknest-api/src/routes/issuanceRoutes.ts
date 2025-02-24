import { Router, Request, Response } from 'express';
import { supabase } from '../lib/db';
import { validateIssuance } from '../middleware/validation';

const router = Router();

// Get all issuances
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('issuance')
      .select(`
        *,
        book (name, publisher),
        member (name, email)
      `);
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch issuances',
      details: error?.message 
    });
  }
});

// Get single issuance
router.get('/:id', async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('issuance')
      .select(`
        *,
        book (name, publisher),
        member (name, email)
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Issuance not found' });
      return;
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch issuance',
      details: error?.message 
    });
  }
});

// Create issuance
router.post('/', validateIssuance, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('issuance')
      .insert({
        book_id: req.body.book_id,
        member_id: req.body.member_id,
        issued_by: req.body.issued_by,
        issue_date: new Date().toISOString(),
        return_date: req.body.return_date,
        status: 'pending'
      })
      .select(`
        *,
        book (name, publisher),
        member (name, email)
      `)
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to create issuance',
      details: error?.message 
    });
  }
});

// Update issuance
router.put('/:id', validateIssuance, async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('issuance')
      .update({
        status: req.body.status,
        return_date: req.body.return_date
      })
      .eq('id', req.params.id)
      .select(`
        *,
        book (name, publisher),
        member (name, email)
      `)
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Issuance not found' });
      return;
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to update issuance',
      details: error?.message 
    });
  }
});

export const issuanceRoutes = router;
