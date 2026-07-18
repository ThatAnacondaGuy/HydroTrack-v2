import { Router } from 'express';
import { z } from 'zod';
import { validateRequest } from '../middleware/validateRequest.js';
import { login, verifyToken, getUser } from '../services/authService.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();

const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(6)
  })
});

router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const token = await login(email, password);
    if (!token) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    res.json({ success: true, data: { token } });
  } catch (err) {
    next(err);
  }
});

router.post('/refresh', authMiddleware, async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    const oldToken = authHeader.split(' ')[1];
    
    // In a real app we'd verify expiration ignoring it for refresh, 
    // or use a separate refresh token. For now, issue new token if valid.
    const decoded = verifyToken(oldToken) as any;
    const user = getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    const newToken = await login(user.email, 'mockpassword'); // Not correct for real refresh, but simplifies demo
    // We can just sign a new token directly:
    import jwt from 'jsonwebtoken';
    import { config } from '../config/env.js';
    const actualNewToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRY }
    );

    res.json({ success: true, data: { token: actualNewToken } });
  } catch (err) {
    next(err);
  }
});

router.get('/me', authMiddleware, (req, res) => {
  res.json({ success: true, data: (req as any).user });
});

export default router;
