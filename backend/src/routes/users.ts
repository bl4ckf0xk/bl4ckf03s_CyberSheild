// src/routes/userRoutes.ts
import { Router, Request, Response } from 'express';
import { logger } from '../utils/logger';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_KEY as string // backend service key
);


// POST /api/users → add a new user
router.post('/add-user', async (req: Request, res: Response) => {
  try {
    const newUser = req.body;

    const { data, error } = await supabase
      .from('users')
      .insert(newUser)
      .select()
      .single();

    if (error) throw error;

    logger.info(`New user created: ${data.id}`);
    return res.status(201).json({ success: true, data });
  }catch (error: any) {
    logger.error('Error creating user:', error);
    return res.status(500).json({ success: false, message: 'Internal server error', error });
  }
});

// GET /api/users/profile/:id
router.get('/profile', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    if (error) throw error;

    logger.info(`Profile fetched for users`);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    logger.error('Error fetching user profile:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});


// GET /api/users/profile/:id
router.get('/profile/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;

    logger.info(`Profile fetched for user ${userId}`);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    logger.error('Error fetching user profile:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// PUT /api/users/profile/:id
router.put('/profile/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    logger.info(`Profile updated for user ${userId}`);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    logger.error('Error updating user profile:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// GET /api/users/:id/incidents
router.get('/:id/incidents', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('reported_by', userId);

    if (error) throw error;

    logger.info(`Incidents fetched for user ${userId}`);
    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    logger.error('Error fetching user incidents:', error.message);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
