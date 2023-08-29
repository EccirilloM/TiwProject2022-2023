import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './types';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getTenRandomThreads = async (req: AuthRequest, res: Response) => {
    try {
      const allThreadIds = await prisma.thread.findMany({
          select: {
              id: true
          }
      });
  
      const randomIds = [];
      for (let i = 0; i < 10; i++) {
          const randomIndex = Math.floor(Math.random() * allThreadIds.length);
          randomIds.push(allThreadIds[randomIndex].id);
          allThreadIds.splice(randomIndex, 1);
      }
  
      const randomThreads = await prisma.thread.findMany({
          where: {
              id: {
                  in: randomIds
              }
          },
          select: {
              id: true,
              title: true,
              createdAt: true,
              userId: true,
              user: {
                  select: {
                      username: true
                  }
              },
              messages: true
          }
      });
  
      for (let thread of randomThreads) {
          const likesCount = await prisma.like.count({
              where: {
                  entityType: "THREAD",
                  entityId: thread.id
              }
          });
  
          const dislikesCount = await prisma.dislike.count({
              where: {
                  entityType: "THREAD",
                  entityId: thread.id
              }
          });
  
          thread["likesCount"] = likesCount;
          thread["dislikesCount"] = dislikesCount;
      }
  
      res.json(randomThreads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  export const searchThread = async (req: AuthRequest, res: Response) => {
    try {
      const searchTerm = req.query.term;
  
      if (typeof searchTerm !== 'string') {
        return res.status(400).json({ message: "Invalid search term" });
      }
  
      const threads = await prisma.thread.findMany({
          where: {
              title: {
                  contains: searchTerm
              }
          },
          select: {
              id: true,
              title: true,
              createdAt: true,
              userId: true,
              user: {
                  select: {
                      username: true
                  }
              },
              messages: true
          }
      });
  
      for (let thread of threads) {
          const likesCount = await prisma.like.count({
              where: {
                  entityType: "THREAD",
                  entityId: thread.id
              }
          });
  
          const dislikesCount = await prisma.dislike.count({
              where: {
                  entityType: "THREAD",
                  entityId: thread.id
              }
          });
  
          thread["likesCount"] = likesCount;
          thread["dislikesCount"] = dislikesCount;
      }
  
      res.json(threads);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  

export const getTenRandomUsers = async (req: AuthRequest, res: Response) => {
  try {
      // Ottieni tutti gli ID degli utenti
      const allUserIds = await prisma.user.findMany({
          select: {
              id: true
          }
      });

      // Seleziona 10 ID a caso
      const randomIds = [];
      for (let i = 0; i < 10; i++) {
          const randomIndex = Math.floor(Math.random() * allUserIds.length);
          randomIds.push(allUserIds[randomIndex].id);
          allUserIds.splice(randomIndex, 1); // Rimuovi l'ID selezionato per evitare duplicati
      }

      // Ottieni i dettagli completi per gli ID casuali selezionati
      const randomUsers = await prisma.user.findMany({
          where: {
              id: {
                  in: randomIds
              }
          },
          select: {
              id: true,
              email: true,
              username: true,
              profileImage: true,
              following: true,
              followers: true,
              threads: true
          },
      });

      res.json(randomUsers);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};
  
export const searchUsers = async (req: AuthRequest, res: Response) => {
  try {
    const searchTerm = req.query.term;

    if (typeof searchTerm !== 'string') {
        return res.status(400).json({ message: "Invalid search term" });
    }

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchTerm,
        },
      },
      select: {
        id: true,
        email: true,
        username: true,
        profileImage: true,
        following: true,
        followers: true,
        threads: true
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
