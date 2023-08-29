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

        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ message: "Errore nel recuperare i thread", error: error.message });
    }
};

