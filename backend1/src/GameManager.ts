import WebSocket from "ws"
import { Game } from "./Game"
import { INIT_GAME, MOVE, REJOIN_GAME } from "./messages"
import { db } from "./db"

export class GameManager {
    private games: Game[]
    private pendingUser: WebSocket | null
    private pendingUserId: string | null
    private users: WebSocket[]

    constructor() {
        this.games = []
        this.pendingUser = null
        this.pendingUserId = null
        this.users = []
    }

    addUser(socket: WebSocket) {
        this.users.push(socket)
        this.addHandler(socket)
        console.log(`User connected. Total users: ${this.users.length}`)
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket)
        
        // If the disconnected user was pending, clear pending state
        if (this.pendingUser === socket) {
            this.pendingUser = null
            this.pendingUserId = null
            console.log("Pending user disconnected")
        }
        
        console.log(`User disconnected. Total users: ${this.users.length}`)
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', async (data) => {
            try {
                const message = JSON.parse(data.toString())
                await this.handleMessage(socket, message)
            } catch (error) {
                console.error("Error handling message:", error)
                socket.send(JSON.stringify({
                    type: "ERROR",
                    message: "Invalid message format"
                }))
            }
        })

        socket.on('close', () => {
            this.removeUser(socket)
        })

        socket.on('error', (error) => {
            console.error("WebSocket error:", error)
            this.removeUser(socket)
        })
    }

    private async handleMessage(socket: WebSocket, message: any) {
        switch (message.type) {
            case INIT_GAME:
                await this.handleInitGame(socket, message)
                break
            case MOVE:
                await this.handleMove(socket, message)
                break
            case REJOIN_GAME:
                await this.handleRejoinGame(socket, message)
                break
            default:
                console.log("Unknown message type:", message.type)
                socket.send(JSON.stringify({
                    type: "ERROR",
                    message: "Unknown message type"
                }))
        }
    }

    private async handleInitGame(socket: WebSocket, message: any) {
        const userId = message.userId

        if (!userId) {
            socket.send(JSON.stringify({
                type: "ERROR",
                message: "User ID is required"
            }))
            return
        }

        // Verify user exists in database
        try {
            const user = await db.user.findUnique({
                where: { id: userId }
            })

            if (!user) {
                socket.send(JSON.stringify({
                    type: "ERROR",
                    message: "User not found"
                }))
                return
            }

            if (this.pendingUser && this.pendingUserId !== userId) {
                // Create game with pending user
                console.log(`Creating game between ${this.pendingUserId} and ${userId}`)
                const game = new Game(this.pendingUser, this.pendingUserId!, socket, userId)
                this.games.push(game)
                this.pendingUser = null
                this.pendingUserId = null
            } else {
                // Add to pending queue
                console.log(`User ${userId} added to pending queue`)
                this.pendingUser = socket
                this.pendingUserId = userId
                
                socket.send(JSON.stringify({
                    type: "WAITING",
                    message: "Waiting for another player..."
                }))
            }
        } catch (error) {
            console.error("Error in handleInitGame:", error)
            socket.send(JSON.stringify({
                type: "ERROR",
                message: "Failed to initialize game"
            }))
        }
    }

    private async handleMove(socket: WebSocket, message: any) {
        const game = this.games.find(game => 
            game.getPlayer1() === socket || game.getPlayer2() === socket
        )

        if (!game) {
            socket.send(JSON.stringify({
                type: "ERROR",
                message: "Game not found"
            }))
            return
        }

        if (!message.move) {
            socket.send(JSON.stringify({
                type: "ERROR",
                message: "Move data is required"
            }))
            return
        }

        console.log("Processing move:", message.move)
        await game.makeMove(socket, message.move)
    }

    private async handleRejoinGame(socket: WebSocket, message: any) {
        const { gameId, userId } = message
        console.log("Inside handle rejoin game:" + gameId + " " + userId)
        if (!gameId || !userId) {
            socket.send(JSON.stringify({
                type: "ERROR",
                message: "Game ID and User ID are required"
            }))
            return
        }

        try {
            // First check if game exists in memory
            let game = this.games.find(game => game.getGameId() === gameId)
            
            if (game) {
                // Game is active in memory, just reconnect the player
                let playerColor: string
                let opponentName: string | null

                if (userId === game.getPlayer1Id()) {
                    game.setPlayer1(socket)
                    opponentName = game.player2Name
                    playerColor = "white"
                } else if (userId === game.getPlayer2Id()) {
                    game.setPlayer2(socket)
                    opponentName = game.player1Name
                    playerColor = "black"
                } else {
                    socket.send(JSON.stringify({
                        type: "ERROR",
                        message: "You are not a player in this game"
                    }))
                    return
                }

                socket.send(JSON.stringify({
                    type: REJOIN_GAME,
                    payload: playerColor,
                    gameId: gameId,
                    opponentName: opponentName,
                    gameState: {
                        fen: game.getBoard().fen(),
                        board: game.getBoard().board(),
                        capturedPieces: [] // You'll need to track this in your Game class
                    }
                }))

                console.log(`Player ${userId} rejoined active game ${gameId} as ${playerColor}`)
                return
            }

            // Game not in memory, try to restore from database
            // const gameData = await db.game.findUnique({
            //     where: { id: gameId },
            // })
            // console.log(gameData)

            // if (!gameData || gameData.status !== 'IN_PROGRESS') {
            //     socket.send(JSON.stringify({
            //         type: "ERROR",
            //         message: "Game not found or already completed"
            //     }))
            //     return
            // }

            // // Verify user is part of this game
            // if (userId !== gameData.whitePlayerId && userId !== gameData.blackPlayerId) {
            //     socket.send(JSON.stringify({
            //         type: "ERROR",
            //         message: "You are not a player in this game"
            //     }))
            //     return
            // }

            // const playerColor = userId === gameData.whitePlayerId ? "white" : "black"

            // // Create a new Game instance and restore its state
            // // For now, we'll create a placeholder - you'd need to implement full restoration
            // const restoredGame = await this.restoreGameFromDatabase(gameData, socket, userId)
            // if (restoredGame) {
            //     this.games.push(restoredGame)
            // }

            // socket.send(JSON.stringify({
            //     type: REJOIN_GAME,
            //     payload: playerColor,
            //     gameId: gameId,
            //     gameState: {
            //         fen: gameData.currentFen || gameData.startingFen,
            //         capturedPieces: [] // Calculate from moves if needed
            //     }
            // }))

            // console.log(`Player ${userId} rejoined restored game ${gameId} as ${playerColor}`)

        } catch (error) {
            console.error("Error in handleRejoinGame:", error)
            socket.send(JSON.stringify({
                type: "ERROR",
                message: "Failed to rejoin game"
            }))
        }
    }

    // private async restoreGameFromDatabase(gameData: any, socket: WebSocket, userId: string): Promise<Game | null> {
    //     // This is a simplified restoration - you'd need to implement full game state restoration
    //     // including applying all moves, determining which player is which socket, etc.
        
    //     // For now, return null to indicate restoration not fully implemented
    //     console.log("Game restoration from database not fully implemented yet")
    //     return null
    // }

    // // Method to clean up completed games periodically
    // public cleanupCompletedGames() {
    //     const activeGames = this.games.filter(game => {
    //         // You might want to add a method to check if game is still active
    //         return true // For now, keep all games
    //     })
        
    //     const removedCount = this.games.length - activeGames.length
    //     this.games = activeGames
        
    //     if (removedCount > 0) {
    //         console.log(`Cleaned up ${removedCount} completed games`)
    //     }
    // }
}