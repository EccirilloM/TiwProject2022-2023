import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getTenRandomThreads = async (req, res) => {
  try {
      // Ottieni tutti gli ID dei thread
      const allThreadIds = await prisma.thread.findMany({
          select: {
              id: true
          }
      });

      // Seleziona 10 ID a caso
      const randomIds = [];
      for (let i = 0; i < 10; i++) {
          const randomIndex = Math.floor(Math.random() * allThreadIds.length);
          randomIds.push(allThreadIds[randomIndex].id);
          allThreadIds.splice(randomIndex, 1); // Rimuovi l'ID selezionato per evitare duplicati
      }

      // Ottieni i dettagli completi per gli ID casuali selezionati
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
              messages: true,
              likes: true,
              dislikes: true
          }
      });

      res.json(randomThreads);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};

export const getTenRandomUsers = async (req, res) => {
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
  

// user.controller.ts
export const searchUsers = async (req, res) => {
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

export const searchThread = async (req, res) => {
  try {
      const searchTerm = req.query.term;

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
              messages: true,
              likes: true,
              dislikes: true
          }
      });

      res.json(threads);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};
