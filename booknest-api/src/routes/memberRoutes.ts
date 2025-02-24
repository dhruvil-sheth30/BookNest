import { Router, Request, Response } from 'express';
import { supabase } from '../lib/db';
import { validateMember } from '../middleware/validation';

const router = Router();

// Get all members
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('member')
      .select(`
        *,
        membership (
          status
        )
      `);
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch members',
      details: error?.message 
    });
  }
});

// Get single member
router.get('/:id', async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('member')
      .select(`
        *,
        membership (
          status
        )
      `)
      .eq('id', req.params.id)
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to fetch member',
      details: error?.message 
    });
  }
});

// Create member
router.post('/', validateMember, async (req: Request, res: Response): Promise<void> => {
  try {
    const { data: member, error: memberError } = await supabase
      .from('member')
      .insert({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      })
      .select()
      .single();

    if (memberError) throw memberError;

    const { data: membership, error: membershipError } = await supabase
      .from('membership')
      .insert({
        member_id: member.id,
        status: 'active'
      })
      .select()
      .single();

    if (membershipError) throw membershipError;

    res.status(201).json({ ...member, membership });
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to create member',
      details: error?.message 
    });
  }
});

// Update member
router.put('/:id', validateMember, async (req: Request<{id: string}>, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('member')
      .update({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      })
      .eq('id', req.params.id)
      .select()
      .single();
    
    if (error) throw error;
    if (!data) {
      res.status(404).json({ error: 'Member not found' });
      return;
    }
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ 
      error: 'Failed to update member',
      details: error?.message 
    });
  }
});

export const memberRoutes = router;
