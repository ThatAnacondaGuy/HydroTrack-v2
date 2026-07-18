import { Router } from 'express';
import { getDashboardSummary, getConsumptionTrend } from '../db/queries/telemetryQueries.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/summary', async (req, res, next) => {
  try {
    const summary = await getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
});

router.get('/trend', async (req, res, next) => {
  try {
    const { start, stop } = req.query;
    const trend = await getConsumptionTrend(start as string, stop as string);
    res.json({ success: true, data: trend });
  } catch (err) {
    next(err);
  }
});

export default router;
