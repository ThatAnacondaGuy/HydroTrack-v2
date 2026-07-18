import { Router } from 'express';
import { getWaterQualitySummary, getTdsTrend, getWaterQualityDevices } from '../db/queries/waterQualityQueries.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', async (req, res, next) => {
  try {
    const summary = await getWaterQualitySummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

router.get('/trend', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days as string) || 7;
    const trend = await getTdsTrend(days);
    res.json({ success: true, data: trend });
  } catch (err) {
    next(err);
  }
});

router.get('/devices', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const devices = await getWaterQualityDevices(page, limit);
    res.json({ success: true, data: devices });
  } catch (err) {
    next(err);
  }
});

export default router;
