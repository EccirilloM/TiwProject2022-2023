import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTenThreadsRandom = async (req, res) => {
    };

export const getTenUserRandom = async (req, res) => {
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