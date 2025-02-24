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

// Outstanding books - simplified version
router.get('/outstanding', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('outstanding_books')
      .select('*');
    
    if (error) throw error;
    res.json(data || []);
  } catch (error: any) {
    console.error('Error fetching outstanding books:', error);
    res.status(500).json({ error: 'Failed to fetch outstanding books' });
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

// Stats endpoint - simplified version
router.get('/stats', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [
      { count: totalBooks },
      { count: totalMembers },
      { data: activeIssuances },
      { data: outstandingBooks },
      { data: pendingReturns }
    ] = await Promise.all([
      supabase.from('book').select('*', { count: 'exact', head: true }),
      supabase.from('member').select('*', { count: 'exact', head: true }),
      supabase.from('issuance').select('*').eq('status', 'pending'),
      supabase.from('issuance')
        .select(`
          book:book_id (name),
          member:member_id (name),
          issue_date,
          return_date,
          status
        `)
        .eq('status', 'pending')
        .lt('return_date', new Date().toISOString())
        .order('return_date'),
      supabase.from('issuance')
        .select(`
          book:book_id (name),
          member:member_id (name),
          issue_date,
          return_date,
          status
        `)
        .eq('status', 'pending')
        .gte('return_date', new Date().toISOString())
        .order('return_date')
    ]);

    res.json({
      totalBooks: totalBooks || 0,
      totalMembers: totalMembers || 0,
      activeIssuances: activeIssuances?.length || 0,
      outstandingBooks: outstandingBooks || [],
      pendingReturns: pendingReturns || []
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export const queryRoutes = router; 