import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllThreadsFollowingAndPropriate = async (req, res) => {
    try {
      const userId = req.user.id; // l'id dell'utente corrente
  
      // Trova l'utente corrente e gli utenti che segue
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { following: true },
      });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Ottieni gli ID degli utenti che l'utente corrente segue
      const followingIds = user.following.map((user) => user.id);
  
      // Aggiungi l'ID dell'utente corrente all'array degli ID da cercare
      followingIds.push(userId);
  
      // Ottieni tutti i thread degli utenti che l'utente corrente segue e i propri, con tutti i dettagli correlati
      const threads = await prisma.thread.findMany({
        where: { userId: { in: followingIds } },
        orderBy: { createdAt: "desc" },
        include: {
          user: true,
          messages: true,
          likes: true,
          dislikes: true,
        },
      });
  
      res.status(200).json(threads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  