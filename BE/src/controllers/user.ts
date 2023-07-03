import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const {username} = req.params;

    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Access Token Required');

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) return res.status(403).send('Invalid Access Token');
      
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
          email: true,
          username: true,
          profileImage: true,
          threads: {
            select: {
              id: true,
              title: true,
              createdAt: true
            },
          },
          messages: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              image: true
            },
          },
          comments: {
            select: {
              id: true,
              text: true
            },
          },
          following: {
            select: {
              id: true,
              followedId: true
            },
          },
          followers: {
            select: {
              id: true,
              followerId: true
            },
          },
          
          likes: {
            select: {
              id: true,
              messageId: true,
              commentId: true,
              threadId: true
            },
          },
          dislikes: {
            select: {
              id: true,
              messageId: true,
              commentId: true,
              threadId: true
            },
          },
          
        },
      });

      if (!user) return res.status(404).send('User not found');

      res.json(user);
    });
  } catch (error) {
    res.status(500).send('Server error');
  }
};

export const updatePhoto = async (req: Request, res: Response) => {
  if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
  }

  try {
      // Utilizziamo un'asserzione di tipo qui per garantire a TypeScript che 'req.user' esiste
      const user = await prisma.user.findUnique({ where: { id: (req as any).user.id } });
      if (!user) {
          res.status(404).send('User not found');
          return;
      }

      await prisma.user.update({
          where: { id: (req as any).user.id },
          data: { profileImage: req.file.filename },
      });

      res.status(200).send(user);
  } catch (err) {
      res.status(500).send(err);
  }
};

export const searchUser = async (req, res) => {
  try {
    const searchTerm = req.query.term;

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: searchTerm,
        },
      },
      select: {
        id: true,
        username: true,
        profileImage: true,
        // Puoi aggiungere qui altri attributi se necessario
      },
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const searchThread = async (req, res) => {
  try {
    const searchTerm = req.query.term;

    const threads = await prisma.thread.findMany({
      where: {
        title: {
          contains: searchTerm,
        },
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        // Aggiungi qui altri attributi se necessario
      },
    });

    // Converte la data di creazione in una stringa ISO
    const formattedThreads = threads.map((thread) => ({
      ...thread,
      createdAt: thread.createdAt.toISOString(),
    }));

    res.json(formattedThreads);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const follow = async (req, res) => {
  try {
    const followerId = (req as any).user.id; // l'id dell'utente che sta facendo la richiesta
    const followedId = Number(req.params.id); // l'id dell'utente da seguire è passato come parametro dell'URL

    // Verifica se l'utente esiste
    const followedUser = await prisma.user.findUnique({ where: { id: followedId } });
    if (!followedUser) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    // Crea il record Follow
    const follow = await prisma.follow.create({
      data: {
        followedId: followedId,
        followerId: followerId,
      },
    });

    res.status(200).json(follow);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const unfollow = async (req, res) => {
  try {
    const followerId = (req as any).user.id; // l'id dell'utente che sta facendo la richiesta
    const followedId = Number(req.params.id); // l'id dell'utente da non seguire più è passato come parametro dell'URL

    // Verifica se l'utente esiste
    const followedUser = await prisma.user.findUnique({ where: { id: followedId } });
    if (!followedUser) {
      return res.status(404).json({ message: "User to unfollow not found" });
    }

    // Elimina il record Follow
    await prisma.follow.deleteMany({
      where: {
        followedId: followedId,
        followerId: followerId,
      },
    });

    res.status(200).json({ message: "Unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const isFollowing = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await prisma.user.findUnique({
      where: { username },
      select: { following: true }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json(user.following);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
};

export const like = async (req, res) => {
  const userId = (req as any).user.id;
  const { entityId, entityType } = req.body;

  const existingLike = await prisma.like.findFirst({
    where: {
      AND: [
        { userId },
        {
          OR: [
            { threadId: entityType === 'Thread' ? entityId : null },
            { messageId: entityType === 'Message' ? entityId : null },
            { commentId: entityType === 'Comment' ? entityId : null },
          ],
        },
      ],
    },
  });

  if (existingLike) {
    await prisma.like.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.like.create({
      data: {
        userId,
        threadId: entityType === 'Thread' ? entityId : null,
        messageId: entityType === 'Message' ? entityId : null,
        commentId: entityType === 'Comment' ? entityId : null,
      },
    });

    if (entityType === 'Thread') {
      await prisma.dislike.deleteMany({
        where: { userId, threadId: entityId },
      });
    } else if (entityType === 'Message') {
      await prisma.dislike.deleteMany({
        where: { userId, messageId: entityId },
      });
    } else if (entityType === 'Comment') {
      await prisma.dislike.deleteMany({
        where: { userId, commentId: entityId },
      });
    }
  }

  res.json({ success: true });
};

export const dislike = async (req, res) => {
  const userId = (req as any).user.id;
  const { entityId, entityType } = req.body;

  const existingLike = await prisma.dislike.findFirst({
    where: {
      AND: [
        { userId },
        {
          OR: [
            { threadId: entityType === 'Thread' ? entityId : null },
            { messageId: entityType === 'Message' ? entityId : null },
            { commentId: entityType === 'Comment' ? entityId : null },
          ],
        },
      ],
    },
  });

  if (existingLike) {
    await prisma.dislike.delete({ where: { id: existingLike.id } });
  } else {
    await prisma.dislike.create({
      data: {
        userId,
        threadId: entityType === 'Thread' ? entityId : null,
        messageId: entityType === 'Message' ? entityId : null,
        commentId: entityType === 'Comment' ? entityId : null,
      },
    });

    if (entityType === 'Thread') {
      await prisma.like.deleteMany({
        where: { userId, threadId: entityId },
      });
    } else if (entityType === 'Message') {
      await prisma.like.deleteMany({
        where: { userId, messageId: entityId },
      });
    } else if (entityType === 'Comment') {
      await prisma.like.deleteMany({
        where: { userId, commentId: entityId },
      });
    }
  }

  res.json({ success: true });
};
