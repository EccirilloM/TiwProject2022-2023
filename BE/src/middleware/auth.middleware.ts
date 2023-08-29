import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../controllers/types';

const prisma = new PrismaClient();

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: number };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    } else {
      req["user"] = user;
      next();
    }
  } catch (error) {
    res.status(400).json({ message: 'Token is not valid' });
  }
};

// Middleware per verificare se l'utente è il proprietario del thread
export const isThreadOwner = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const threadId = parseInt(req.params.threadId, 10);
  const userId = req.user.id;

  const thread = await prisma.thread.findUnique({ where: { id: threadId } });

  if (!thread || thread.userId !== userId) {
    return res.status(403).json({ message: 'You are not authorized to modify this thread' });
  }
  
  next();
};
