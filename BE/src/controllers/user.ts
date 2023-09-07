import jwt from 'jsonwebtoken';
import { EntityType, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { AuthRequest } from './types';

const prisma = new PrismaClient();

//Metodo per ritornarmi le informazioni basiche sull'utente
export const getUserBasicInfo = async (req: Request, res: Response) => {
  try {
    const { username } = req.params;
    
    const user = await prisma.user.findUnique({
      where: {
        username: username,
      },
      select: {
        username: true,
        name: true,
        surname: true,
        profileImage: true,
        joinedAt: true,
      },
    });

    if (!user) return res.status(404).send('User not found');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server error');
  }
};

//Metodo che mi ritorna tutte le informazioni sull'utente, lo uso solo per la pagina profilo
export const getUserAllInfo = async (req: AuthRequest, res: Response) => {
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
          name: true,
          description: true,
        surname: true,
        joinedAt: true,
          profileImage: true,
          threads: {
            select: {
              id: true,
              title: true,
              createdAt: true,
              likeCount: true,
              dislikeCount: true     
            },
          },
          messages: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              image: true,
              likeCount: true,
              dislikeCount: true 
            },
          },
          comments: {
            select: {
              id: true,
              text: true,
              likeCount: true,
              dislikeCount: true
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

//Metodo per aggiornare l'immagine profilo
export const updateProfileImage = async (req: AuthRequest, res: Response) => {
  if (!req.file) {
      res.status(400).send('No file uploaded.');
      return;
  }

  try {
      // Utilizziamo un'asserzione di tipo qui per garantire a TypeScript che 'req.user' esiste
      const user = await prisma.user.findUnique({ where: { id: req.user.id } });
      if (!user) {
          res.status(404).send('User not found');
          return;
      }

      // Verifica se l'utente autenticato è lo stesso dell'utente del quale si sta cercando di modificare l'immagine
      if (req.user.id !== user.id) {
          res.status(403).send('You are not authorized to change this profile image.');
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

//Metodo per gestire il follow/unfollow
export const handleFollow = async (req: AuthRequest, res: Response) => {
  try {
    const followerId = (req as any).user.id;
    const { followedId } = req.body;

    if (followerId === followedId) {
      return res.status(400).json({ message: "You cannot follow/unfollow yourself" });
    }

    // Verifica se l'utente esiste
    const followedUser = await prisma.user.findUnique({ where: { id: followedId } });
    if (!followedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Cerca un follow esistente
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followedId: {
          followerId: followerId,
          followedId: followedId,
        },
      },
    });

    if (existingFollow) {
      // Se esiste, elimina il follow (toggle follow)
      await prisma.follow.delete({
        where: {
          followerId_followedId: {
            followerId: followerId,
            followedId: followedId,
          },
        },
      });
      return res.json({ message: "Unfollowed", isFollowing: false, username: followedUser.username});
    } else {
      // Se non esiste, crea un nuovo follow
      await prisma.follow.create({
        data: {
          followedId: followedId,
          followerId: followerId,
        },
      });
      return res.json({ message: "Followed", isFollowing: true, username: followedUser.username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//Metodo per vedere se un utente segue già un altro utente
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
    return res.json({ isFollowing: Boolean(following), username: userToCheck.username });


  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Metodo per gestire il like
export const handleLike = async (req: AuthRequest, res: Response) => {
  const { entityId, entityType } = req.body;
  const userId = req.user.id;

  // Mapping per identificare la chiave appropriata e il modello basato su entityType
  const entityMapping = {
    thread: { column: "threadId", model: "thread" },
    comment: { column: "commentId", model: "comment" },
    message: { column: "messageId", model: "message" },
  };

  const { column, model } = entityMapping[entityType] || {};

  if (!column || !model) {
    return res.status(400).json({ message: "Invalid entity type" });
  }

  try {
    // Cerca un like esistente
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: userId,
        entityType: entityType.toUpperCase(),
        entityId: parseInt(entityId, 10),
      },
    });
    

    if (existingLike) {
      // Se esiste, elimina il like e decrementa il contatore (toggle like)
      await prisma.like.delete({ where: { id: existingLike.id } });
      if (model === "thread") {
        await prisma.thread.update({
          where: { id: parseInt(entityId, 10) },
          data: { likeCount: { decrement: 1 } },
        });
      } else if (model === "comment") {
        await prisma.comment.update({
          where: { id: parseInt(entityId, 10) },
          data: { likeCount: { decrement: 1 } },
        });
      } else if (model === "message") {
        await prisma.message.update({
          where: { id: parseInt(entityId, 10) },
          data: { likeCount: { decrement: 1 } },
        });
      } else {
        return res.status(400).json({ message: "Invalid model" });
      }
      
      return res.json({ message: "Like removed" });
    } else {
      // Se non esiste, crea un nuovo like e incrementa il contatore
      await prisma.like.create({
        data: {
          userId,
          entityType: entityType.toUpperCase(),
          entityId: parseInt(entityId, 10),
        },
      });
      
      if (model === "thread") {
        await prisma.thread.update({
          where: { id: parseInt(entityId, 10) },
          data: { likeCount: { increment: 1 } },
        });
      } else if (model === "comment") {
        await prisma.comment.update({
          where: { id: parseInt(entityId, 10) },
          data: { likeCount: { increment: 1 } },
        });
      } else if (model === "message") {
        await prisma.message.update({
          where: { id: parseInt(entityId, 10) },
          data: { likeCount: { increment: 1 } },
        });
      } else {
        return res.status(400).json({ message: "Invalid model" });
      }
      
      return res.json({ message: "Like added" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Metodo per gestire il Dislike
export const handleDislike = async (req: AuthRequest, res: Response) => {
  const { entityId, entityType } = req.body;
  const userId = req.user.id;

  // Mapping per identificare la chiave appropriata e il modello basato su entityType
  const entityMapping = {
    thread: { column: "threadId", model: "thread" },
    comment: { column: "commentId", model: "comment" },
    message: { column: "messageId", model: "message" },
  };

  const { column, model } = entityMapping[entityType] || {};

  if (!column || !model) {
    return res.status(400).json({ message: "Invalid entity type" });
  }

  try {
    // Cerca un dislike esistente
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        userId: userId,
        entityType: entityType.toUpperCase(),
        entityId: parseInt(entityId, 10),
      },
    });
    

    if (existingDislike) {
      // Se esiste, elimina il dislike e decrementa il contatore (toggle dislike)
      await prisma.dislike.delete({ where: { id: existingDislike.id } });
      if (model === "thread") {
        await prisma.thread.update({
          where: { id: parseInt(entityId, 10) },
          data: { dislikeCount: { decrement: 1 } },
        });
      } else if (model === "comment") {
        await prisma.comment.update({
          where: { id: parseInt(entityId, 10) },
          data: { dislikeCount: { decrement: 1 } },
        });
      } else if (model === "message") {
        await prisma.message.update({
          where: { id: parseInt(entityId, 10) },
          data: { dislikeCount: { decrement: 1 } },
        });
      } else {
        return res.status(400).json({ message: "Invalid model" });
      }
      
      return res.json({ message: "Dislike removed" });
    } else {
      // Se non esiste, crea un nuovo dislike e incrementa il contatore
      await prisma.dislike.create({
        data: {
          userId,
          entityType: entityType.toUpperCase(),
          entityId: parseInt(entityId, 10),
        },
      });      
      if (model === "thread") {
        await prisma.thread.update({
          where: { id: parseInt(entityId, 10) },
          data: { dislikeCount: { increment: 1 } },
        });
      } else if (model === "comment") {
        await prisma.comment.update({
          where: { id: parseInt(entityId, 10) },
          data: { dislikeCount: { increment: 1 } },
        });
      } else if (model === "message") {
        await prisma.message.update({
          where: {id: parseInt(entityId, 10) },
          data: { dislikeCount: { increment: 1 } },
        });
      } else {
        return res.status(400).json({ message: "Invalid model" });
      }
      
      return res.json({ message: "Dislike added" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//Metodo per vedere se l'utente ha giò messo like ad un'entità
export const checkLikeStatus = async (req: AuthRequest, res: Response) => {
  try {
    const entityId = req.params.entityId;
    const entityType = req.params.entityType.toUpperCase(); // Converte in maiuscolo
    const loggedUserId = (req as any).user.id;  // l'id dell'utente loggato

    const existingLike = await prisma.like.findFirst({
      where: {
        userId: loggedUserId,
        entityType: entityType as EntityType, // Cast esplicito
        entityId: parseInt(entityId),
      },
    });
    
    const existingDislike = await prisma.dislike.findFirst({
      where: {
        userId: loggedUserId,
        entityType: entityType as EntityType, // Cast esplicito
        entityId: parseInt(entityId),
      },
    });    

    return res.json({
      likeStatus: existingLike ? 'like' : existingDislike ? 'dislike' : null
    });

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

// Metodo per creare un Messaggio
export const createMessage = async (req: AuthRequest, res: Response) => {
  const text = req.body.text;
  const threadId = parseInt(req.params.threadId);
  const userId = req.user.id;
  let image = null;
  
  if (req.file) {
    image = req.file.filename; // Ora il nome del file è gestito da multer
  }

  try {
    const newMessage = await prisma.message.create({
      data: {
        text,
        image, // Se non c'è file, sarà null
        userId,
        threadId,
      },
      select: {
        id: true,
        text: true,
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
    return res.status(201).json(newMessage);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Metodo per uploudare l'immagine del messaggio
export const uploadMessageImage = async (req: AuthRequest, res: Response) => {
  const messageId = parseInt(req.params.messageId);
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    const message = await prisma.message.findUnique({ where: { id: messageId } });
    if (!message) {
      return res.status(404).send('Message not found.');
    }

    await prisma.message.update({
      where: { id: messageId },
      data: { image: req.file.filename },
    });

    return res.status(200).send({message: 'Image uploaded successfully'});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Metodo per creare un Commento
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

