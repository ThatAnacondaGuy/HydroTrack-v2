import { Request, Response, NextFunction } from 'express';
import { verifyToken, getUser } from '../services/authService.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token) as any;
    const user = getUser(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    (req as any).user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }
}
