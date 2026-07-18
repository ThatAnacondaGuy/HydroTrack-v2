import { Router } from 'express';
import { getThermalHazards } from '../db/queries/thermalQueries.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const { status } = req.query;
    const hazards = await getThermalHazards(page, limit, status as string);
    res.json({ success: true, data: hazards });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/ack', async (req, res, next) => {
  try {
    const { id } = req.params;
    // Here we would acknowledge the hazard in DB
    res.json({ success: true, data: { id, status: 'acknowledged' } });
  } catch (err) {
    next(err);
  }
});

export default router;
