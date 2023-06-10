import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send('Access Token Required');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decodedToken) => {
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
