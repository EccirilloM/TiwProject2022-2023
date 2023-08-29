import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from './types';

const prisma = new PrismaClient();

export const getUser = async (req: AuthRequest, res: Response) => {
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
              entityType: true,  // Aggiunto questo
              entityId: true     // Aggiunto questo
            },
          },
          dislikes: {
            select: {
              id: true,
              entityType: true,  // Aggiunto questo
              entityId: true     // Aggiunto questo
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

export const updatePhoto = async (req: AuthRequest, res: Response) => {
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

export const follow = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = (req as any).user.id;
    const { followedId } = req.body; 

    if (followerId === followedId) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Verifica se l'utente esiste
    const followedUser = await prisma.user.findUnique({ where: { id: followedId } });
    if (!followedUser) {
      return res.status(404).json({ message: "User to follow not found" });
    }

    // Verifica se l'utente sta già seguendo l'altro utente
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: followerId,
          followedId: followedId,
        },
      },
    });

    if (existingFollow) {
      return res.status(400).json({ message: "You're already following this user" });
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

export const unfollow = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = req.user.id; 
    const { followedId } = req.body;

    if (followerId === followedId) {
      return res.status(400).json({ message: "You cannot unfollow yourself" });
    }

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

export const isFollowing = async (req: AuthRequest, res: Response) => {
  try {
    const username = req.params.username;
    const loggedUserId = (req as any).user.id;  // l'id dell'utente loggato

    // Trova l'utente basato sullo username
    const userToCheck = await prisma.user.findUnique({
      where: { username },
    });

    if (!userToCheck) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verifica se l'utente loggato segue l'utente cercato
    const following = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followedId: userToCheck.id,
          followerId: loggedUserId
        },
      },
    });

    // Se 'following' esiste, allora l'utente loggato segue l'utente cercato
    return res.json({ isFollowing: Boolean(following) });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req: AuthRequest, res: Response) => {
};

export const handleLike = async (req: AuthRequest, res: Response) => {
  const { entityId, entityType } = req.body;
  const userId = req.user.id;

  // Mapping per identificare la chiave appropriata basata su entityType
  const entityMapping = {
    thread: "threadId",
    comment: "commentId",
    message: "messageId"
  };

  const column = entityMapping[entityType];

  if (!column) {
    return res.status(400).json({ message: "Invalid entity type" });
  }

  try {
    // Cerca un like esistente
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        [column]: entityId
      }
    });

    if (existingLike) {
      // Se esiste, elimina il like (toggle like)
      await prisma.like.delete({ where: { id: existingLike.id } });
      return res.json({ message: "Like removed" });
    } else {
      // Se non esiste, crea un nuovo like
      await prisma.like.create({
        data: {
          userId: userId,
          entityType: entityType,  // Usiamo entityType
          entityId: entityId  // e entityId
        }
      });
      return res.json({ message: "Like added" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const handleDislike = async (req: AuthRequest, res: Response) => {
  const { entityId, entityType } = req.body;
  const userId = req.user.id;

  // Mapping per identificare la chiave appropriata basata su entityType
  const entityMapping = {
    thread: "threadId",
    comment: "commentId",
    message: "messageId"
  };

  const column = entityMapping[entityType];

  if (!column) {
    return res.status(400).json({ message: "Invalid entity type" });
  }

  try {
    // Cerca un dislike esistente
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        userId: userId,
        [column]: entityId
      }
    });

    if (existingDislike) {
      // Se esiste, elimina il dislike (toggle dislike)
      await prisma.dislike.delete({ where: { id: existingDislike.id } });
      return res.json({ message: "Dislike removed" });
    } else {
      // Se non esiste, crea un nuovo dislike
      await prisma.dislike.create({
        data: {
          userId: userId,
          entityType: entityType,  // Usiamo entityType
          entityId: entityId  // e entityId
        }
      });
      return res.json({ message: "Dislike added" });
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Metodo per creare un Thread
export const createThread = async (req: AuthRequest, res: Response) => {
  const { title } = req.body;
  const userId = req.user.id;

  try {
    const newThread = await prisma.thread.create({
      data: {
        title,
        userId
      }
    });
    return res.status(201).json(newThread);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Metodo per creare un Message (con middleware isThreadOwner)
export const createMessage = async (req: AuthRequest, res: Response) => {
  const { text, image } = req.body;
  const threadId = parseInt(req.params.threadId);
  const userId = req.user.id;

  try {
    const newMessage = await prisma.message.create({
      data: {
        text,
        image,
        userId,
        threadId
      }
    });
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Metodo per creare un Comment
export const createComment = async (req: AuthRequest, res: Response) => {
  const { text } = req.body;
  const messageId = parseInt(req.params.messageId);
  const userId = req.user.id;

  try {
    const newComment = await prisma.comment.create({
      data: {
        text,
        userId,
        messageId
      }
    });
    return res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};