import { Router, Request, Response } from 'express';
import { supabase } from '../lib/db';
import { validateMember } from '../middleware/validation';

const router = Router();

// Get all members
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const { data: members, error: memberError } = await supabase
      .from('member')
      .select(`
        id,
        name,
        phone,
        email,
        membership (
          status
        )
      `)
      .order('name');
    
    if (memberError) throw memberError;

    const transformedData = members?.map(member => ({
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone,
      membership_status: member.membership?.[0]?.status || 'inactive'
    }));

    res.json(transformedData);
  } catch (error: any) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});

// Get single member
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { data, error } = await supabase
      .from('member')
      .select(`
        *,
        membership (status)
      `)
      .eq('id', req.params.id)
      .single();

    if (error) throw error;
    
    res.json({
      ...data,
      membership_status: data.membership?.[0]?.status || 'inactive'
    });
  } catch (error: any) {
    console.error('Error fetching member:', error);
    res.status(500).json({ 
      error: 'Failed to fetch member',
      details: error?.message 
    });
  }
});

// Create member
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // First check if email already exists
    const { data: existingMember } = await supabase
      .from('member')
      .select('id')
      .eq('email', req.body.email)
      .single();

    if (existingMember) {
      res.status(400).json({ 
        error: 'Member already exists',
        details: 'A member with this email already exists'
      });
      return;
    }

    const { data, error } = await supabase
      .from('member')
      .insert({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      })
      .select()
      .single();

    if (error) throw error;

    // Create membership status
    const { error: membershipError } = await supabase
      .from('membership')
      .insert({
        member_id: data.id,
        status: req.body.membership_status || 'active'
      });

    if (membershipError) throw membershipError;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating member:', error);
    res.status(500).json({ 
      error: 'Failed to create member',
      details: error?.message 
    });
  }
});

// Update member
router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    console.log('Updating member:', id, 'with data:', req.body); // Debug log

    // First check if membership exists
    const { data: existingMembership, error: checkError } = await supabase
      .from('membership')
      .select('id')
      .eq('member_id', id)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw checkError;
    }

    // Start transaction with member update
    const { data: member, error: memberError } = await supabase
      .from('member')
      .update({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      })
      .eq('id', id)
      .select()
      .single();

    if (memberError) throw memberError;

    // Handle membership status - either update or insert
    const membershipOperation = existingMembership
      ? supabase
          .from('membership')
          .update({ status: req.body.membership_status })
          .eq('member_id', id)
      : supabase
          .from('membership')
          .insert({ 
            member_id: id, 
            status: req.body.membership_status || 'active'
          });

    const { error: membershipError } = await membershipOperation;
    if (membershipError) throw membershipError;

    // Get updated data
    const { data: updatedMember, error: fetchError } = await supabase
      .from('member')
      .select(`
        *,
        membership!inner (status)
      `)
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    res.json({
      ...updatedMember,
      membership_status: updatedMember.membership?.[0]?.status || 'inactive'
    });
  } catch (error: any) {
    console.error('Error updating member:', error);
    res.status(500).json({ 
      error: 'Failed to update member',
      details: error?.message 
    });
  }
});

export const memberRoutes = router;
