import { db } from "../db";
import { AuthProvider, User, GameStatus } from "@prisma/client";

interface UserData {
    username?: string | null
    name?: string | null,
    email: string,
    password?: string | null,
    provider: AuthProvider
}

interface CreateUserResponse {
    success: boolean;
    user?: Omit<User, 'password'>;
    error?: string;
}

export const userService = {
    findByGoogleId: async (googleId: string) => {
        try {
            const user = await db.user.findFirst({
                where: {
                    username: googleId,
                    provider: AuthProvider.GOOGLE
                }
            })
            if (user) {
                const { password, ...safeUser } = user;

                return safeUser
            }
        }
        catch (e) {
            console.error("Error finding user by Google ID:", e);
            throw new Error("Database error while finding user");
        }
    },

    createUser: async (userData: UserData) => {
        try {
            const user = await db.user.create({
                data: {
                    username: userData.username,
                    email: userData.email,
                    name: userData.name,
                    password: userData.password,
                    provider: userData.provider,
                    lastLogin: new Date()
                }
            })

            const { password, ...safeUser } = user;

            return {
                success: true,
                user: safeUser
            };
        }
        catch (error) {
            console.error("Error creating user:", error);
            return {
                success: false,
                error: "Failed to create user"
            };
        }
    },

    updateLastLogin: async (userId: string) => {
        return await db.user.update({
            where: { id: userId },
            data: { lastLogin: new Date() }
        })
    },

    getGamesPlayed: async (userId: string) => {
        const [gamesAsWhite, gamesAsBlack, user] = await Promise.all([
            db.game.findMany({
                where: {whitePlayerId: userId},
                select: {
                    result: true,
                    status: true
                }
            }),
            db.game.findMany({
                where: {blackPlayerId: userId},
                select: {
                    result: true,
                    status: true
                }
            }),
            db.user.findUnique({
                where: {id: userId},
                select: {
                    rating: true,
                    createdAt: true
                }
            }) 
        ]);
        return {gamesAsWhite, gamesAsBlack, user}
    }
}