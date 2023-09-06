import { PrismaClient } from '@prisma/client';
import { AuthRequest } from './types';
import { Response } from 'express';

const prisma = new PrismaClient();

export const getTenThreadsFollowingAndPropriate = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user.id; 

        const following = await prisma.follow.findMany({
            where: {
                followerId: userId
            },
            select: {
                followedId: true
            }
        });
        const followingIds = following.map(follow => follow.followedId);
        followingIds.push(userId);

        const page = parseInt(req.query.page as string, 10) || 1;
        const skip = (page - 1) * 10;

        const threads = await prisma.thread.findMany({
            where: {
                userId: {
                    in: followingIds
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            skip: skip,
            take: 10,
            select: {
                id: true,
                title: true,
                createdAt: true,
                userId: true,
                user: {
                    select: {
                        username: true,
                        profileImage: true
                    }
                },
                messages: true
            }
        });

        for (let thread of threads) {
            const likeCount = await prisma.like.count({
                where: {
                    entityType: "THREAD",
                    entityId: thread.id
                }
            });

            const dislikeCount = await prisma.dislike.count({
                where: {
                    entityType: "THREAD",
                    entityId: thread.id
                }
            });

            thread["likeCount"] = likeCount;
            thread["dislikeCount"] = dislikeCount;
        }

        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recuperare i thread", error: error.message });
    }
};

export const getThreadInfo = async (req: AuthRequest, res: Response) => {
    try {
      const threadId = parseInt(req.params.threadId, 10);
  
      const thread = await prisma.thread.findUnique({
        where: { id: threadId },
        select: {
          id: true,
          title: true,
          createdAt: true,
          likeCount: true,
          dislikeCount: true,
          user: {
            select: {
              username: true,
            },
          },
        },
      });
  
      if (!thread) {
        return res.status(404).json({ message: 'Thread non trovato.' });
      }
  
      res.status(200).json(thread);
    } catch (error) {
      res.status(500).json({ message: 'Errore nel recuperare le informazioni sul thread.', error: error.message });
    }
  };

export const getThreadMessages = async (req: AuthRequest, res: Response) => {
  try {
    const threadId = parseInt(req.params.threadId, 10);

    const messages = await prisma.message.findMany({
      where: { threadId: threadId },
      select: {
        id: true,
        text: true,
        image: true, // Aggiungi questa linea
        createdAt: true,
        likeCount: true,
        dislikeCount: true,
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });    

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare i messaggi del thread.', error: error.message });
  }
};

export const getMessageComments = async (req: AuthRequest, res: Response) => {
  try {
    const messageId = parseInt(req.params.messageId, 10);

    const comments = await prisma.comment.findMany({
      where: { messageId: messageId },
      select: {
        id: true,
        text: true,
        likeCount: true,
        dislikeCount: true,
        user: {
          select: {
            username: true,
            profileImage: true,
          },
        },
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Errore nel recuperare i commenti del messaggio.', error: error.message });
  }
};
  
  

