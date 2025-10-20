import WebSocket from "ws"
import { Chess } from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./messages"
import { db } from "./db"
import { GameStatus, TimeControl } from "@prisma/client"

interface Move {
    from: string,
    to: string,
    promotion?: string
}

export class Game {
    private player1: WebSocket
    private player2: WebSocket
    private board: Chess
    private moves: Move[]
    private gameId!: string
    private player1Id: string
    private player2Id: string
    public player1Name: string | null = null
    public player2Name: string | null = null
    public capturedByWhite: string[] = []
    public capturedByBlack: string[] = []

    constructor(player1: WebSocket, player1Id: string, player2: WebSocket, player2Id: string) {
        this.player1 = player1
        this.player1Id = player1Id
        this.player2 = player2
        this.player2Id = player2Id
        this.board = new Chess()
        this.moves = []
        this.initializeGame()
    }


    private async initializeGame() {
        try {
            // Get both players' information from database
            const [player1Data, player2Data] = await Promise.all([
                db.user.findUnique({
                    where: { id: this.player1Id },
                    select: { name: true, username: true }
                }),
                db.user.findUnique({
                    where: { id: this.player2Id },
                    select: { name: true, username: true }
                })
            ])

            // If not found, throw an error
            if (!player1Data || !player2Data) {
                console.error("Could not find player data")
                this.handleInitError("Player not found")
                return
            }

            // Create game record in database
            const game = await db.game.create({
                data: {
                    whitePlayerId: this.player1Id,
                    blackPlayerId: this.player2Id,
                    status: GameStatus.IN_PROGRESS,
                    timeControl: TimeControl.CLASSICAL,
                    startingFen: this.board.fen(),
                    currentFen: this.board.fen()
                }
            })

            this.gameId = game.id
            
            // Send initialization messages to both players
            this.player1Name = player1Data.name!
            this.player2Name = player2Data.name!

            this.player1.send(JSON.stringify({
                type: INIT_GAME,
                payload: "white",
                gameId: this.gameId,
                userId: this.player1Id,
                opponentName: this.player2Name,
            }))

            this.player2.send(JSON.stringify({
                type: INIT_GAME,
                payload: "black",
                gameId: this.gameId,
                userId: this.player2Id,
                opponentName: this.player1Name,
            }))

            console.log(`Game ${this.gameId} initialized between ${this.player1Name} (white) and ${this.player2Name} (black)`)

        } catch (error) {
            console.error("Error initializing game:", error)
            this.handleInitError("Failed to initialize game")
        }
    }

    private handleInitError(message: string) {
        const errorMessage = JSON.stringify({
            type: "ERROR",
            message: message
        })

        this.player1.send(errorMessage)
        this.player2.send(errorMessage)
    }

    getPlayer1() {
        return this.player1;
    }

    getPlayer1Id() {
        return this.player1Id;
    }

    getPlayer2() {
        return this.player2;
    }

    getPlayer2Id() {
        return this.player2Id;
    }

    getBoard() {
        return this.board;
    }

    getGameId() {
        return this.gameId;
    }

    setPlayer1(socket: WebSocket) {
        this.player1 = socket;
    }

    setPlayer2(socket: WebSocket) {
        this.player2 = socket;
    }

    makeMove(socket: WebSocket, move: Move) {
        if (this.moves.length % 2 == 0 && socket !== this.player1) {
            return
        }

        if (this.moves.length % 2 == 1 && socket !== this.player2) {
            return
        }
        try {
            let moveResult;
            moveResult = this.board.move(move)
            this.moves.push(move)
            console.log(this.board.ascii())
            if (moveResult && moveResult.captured) {
            
            if (this.board.turn() === 'b') { 
                this.capturedByWhite.push(moveResult.captured)
            } else { 
                this.capturedByBlack.push(moveResult.captured)
            }
        }
        } catch (e) {
            console.log(e)
            return
        }
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move,
            capturedByWhite: this.capturedByWhite,
            capturedByBlack: this.capturedByBlack
        }))

        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move,
            capturedByWhite: this.capturedByWhite,
            capturedByBlack: this.capturedByBlack
        }))

        if (this.board.isGameOver()) {
            let winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                winner: winner,
                turn: this.board.turn() === "w" ? "black" : "white",
                payload: move
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                winner: winner,
                turn: this.board.turn() === "w" ? "black" : "white",
                payload: move
            }))
            return
        }



    }
}