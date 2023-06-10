import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Access Token Required');

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
      if (err) return res.status(403).send('Invalid Access Token');
      
      const user = await prisma.user.findUnique({
        where: {
          id: decodedToken.id,
        },
        select: {
          id: true,
          email: true,
          username: true,
          profileImage: true,
          posts: {
            select: {
              id: true,
              text: true,
              createdAt: true,
              image: true
            },
          },
          threads: {
            select: {
              id: true,
              title: true,
              createdAt: true
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
          comments: {
            select: {
              id: true,
              text: true
            },
          },
          likes: {
            select: {
              id: true,
              postId: true,
              commentId: true,
              threadId: true
            },
          },
          dislikes: {
            select: {
              id: true,
              postId: true,
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

export const getAllUsers = async (req, res) => {
};

export const searchUser = async (req, res) => {
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


export const follow = async (req, res) => {
};

export const unfollow = async (req, res) => {
};