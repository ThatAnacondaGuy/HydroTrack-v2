import { Router } from 'express';
import { getAnomalies, getAnomaliesForExport } from '../db/queries/anomalyQueries.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const { type, status, zone, startDate, endDate } = req.query;
    const anomalies = await getAnomalies(page, limit, type as string, status as string, zone as string, startDate as string, endDate as string);
    res.json({ success: true, data: anomalies });
  } catch (err) {
    next(err);
  }
});

router.patch('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    // Here we would write back to InfluxDB or Postgres
    res.json({ success: true, data: { id, status } });
  } catch (err) {
    next(err);
  }
});

router.get('/export', async (req, res, next) => {
  try {
    const anomalies = await getAnomaliesForExport(req.query);
    res.header('Content-Type', 'text/csv');
    res.attachment('anomalies.csv');
    res.send('id,type,status\n'); // Mock CSV
  } catch (err) {
    next(err);
  }
});

export default router;
