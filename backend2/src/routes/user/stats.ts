import express, { Request, Response, Router } from "express"
import { userService } from "../../services/userService"
import { $Enums, GameStatus, GameResult } from "@prisma/client"
import { db } from "../../db"

const router = Router()

router.get("/stats/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params
        const { gamesAsWhite, gamesAsBlack, user }: {
            gamesAsWhite: {
                result: $Enums.GameResult | null;
                status: $Enums.GameStatus;
            }[];
            gamesAsBlack: {
                result: $Enums.GameResult | null;
                status: $Enums.GameStatus;
            }[];
            user: {
                rating: number;
                createdAt: Date;
            } | null;
        } = await userService.getGamesPlayed(userId)

        const allGames = [...gamesAsWhite, ...gamesAsBlack];
        const completedGames = allGames.filter(g => g.status === GameStatus.COMPLETED)

        const wins = completedGames.filter(game =>
            (gamesAsWhite.includes(game) && game.result === GameResult.WHITE_WINS) ||
            (gamesAsBlack.includes(game) && game.result === GameResult.BLACK_WINS)
        ).length;

        const losses = completedGames.filter(game =>
            (gamesAsWhite.includes(game) && game.result === GameResult.BLACK_WINS) ||
            (gamesAsBlack.includes(game) && game.result === GameResult.WHITE_WINS)
        ).length;

        const draws = completedGames.filter(game => { game.result === GameResult.DRAW }).length

        const stats = {
            rating: user?.rating || 800,
            gamesPlayed: completedGames.length,
            wins,
            losses,
            draws,
            winRate: completedGames.length > 0 ? Math.round((wins / completedGames.length) * 100) : 0,
            joinDate: user?.createdAt.toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric'
            })
        }

        res.json(stats)

    } catch (error) {
        console.error('Error fetching user stats:', error);
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
})

router.post("/updateName/:userId", async (req: Request , res: Response) => {
    try {
        const { userId } = req.params
        await db.user.update({
            where: {id: userId},
            data: {
                name: req.body.name
            }
        })

        res.status(200).json({message: "Name successfully updated"})

    } catch (error) {
        console.error('Error updating user name:', error);
        res.status(500).json({ error: 'Failed to update name' });
    }
})

router.get("/games/:userId", async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const limit = parseInt(req.query.limit as string) || 10

        const games = db.game.findMany({
            where: {
                OR: [
                    { whitePlayerId: userId },
                    { blackPlayerId: userId }
                ],
                status: GameStatus.COMPLETED
            },
            include: {
                whitePlayer: {
                    select: {
                        name: true,
                        username: true,
                        rating: true
                    }
                },
                blackPlayer: {
                    select: {
                        name: true,
                        username: true,
                        rating: true
                    }
                }
            },
            orderBy: {
                endAt: 'desc'
            },
            take: limit
        });

        res.json(games)
    } catch (error) {
        console.error('Error fetching user games: ', error);
        res.status(500).json({ error: "Failed to fetch games" })
    }
})

export const userStatsRoute = router