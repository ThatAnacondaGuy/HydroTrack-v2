import { Router } from 'express';
import { getZones } from '../db/queries/deviceQueries.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const zones = await getZones();
    res.json({ success: true, data: zones });
  } catch (err) {
    next(err);
  }
});

export default router;
