import { Router } from 'express';
import { getDevicesGeo, getDeviceDetail, getDeviceFleet } from '../db/queries/deviceQueries.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/geo', async (req, res, next) => {
  try {
    const geo = await getDevicesGeo();
    res.json({ success: true, data: geo });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const detail = await getDeviceDetail(req.params.id);
    res.json({ success: true, data: detail });
  } catch (err) {
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const { zone, status } = req.query;
    const fleet = await getDeviceFleet(page, limit, zone as string, status as string);
    res.json({ success: true, data: fleet });
  } catch (err) {
    next(err);
  }
});

export default router;
