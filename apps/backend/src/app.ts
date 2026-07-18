import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';

import authRoutes from './routes/auth.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js';
import devicesRoutes from './routes/devices.routes.js';
import anomaliesRoutes from './routes/anomalies.routes.js';
import waterQualityRoutes from './routes/waterQuality.routes.js';
import thermalHazardsRoutes from './routes/thermalHazards.routes.js';
import zonesRoutes from './routes/zones.routes.js';

import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(pinoHttp());

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/devices', devicesRoutes);
app.use('/api/anomalies', anomaliesRoutes);
app.use('/api/water-quality', waterQualityRoutes);
app.use('/api/thermal-hazards', thermalHazardsRoutes);
app.use('/api/zones', zonesRoutes);

app.use(errorHandler);
