// types.ts
import { Request } from 'express';
import { User } from '@prisma/client'; // Se vuoi utilizzare il tipo User completo da Prisma

export interface AuthRequest extends Request {
  user: User;
}