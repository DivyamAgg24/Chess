import WebSocket from "ws"
import { Game } from "./Game"
import { INIT_GAME, MOVE, REJOIN_GAME } from "./messages"
import { v4 as uuidv4 } from "uuid"

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
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user != socket)
    }

    private addHandler(socket: WebSocket) {
        socket.on('message', (data) => {
            const message = JSON.parse(data.toString())
            if(message.type === INIT_GAME) {
                const userId = uuidv4()

                if(this.pendingUser) {
                    const game = new Game(this.pendingUser, this.pendingUserId!, socket, userId)
                    this.games.push(game)
                    this.pendingUser = null
                    this.pendingUserId = null
                }
                else{
                    this.pendingUser = socket
                    this.pendingUserId = userId
                }
            }

            if(message.type === MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket)
                if (game) {
                    console.log(message.move)
                    game.makeMove(socket, message.move)
                }
            }

            if(message.type === REJOIN_GAME) {
                const game = this.games.find(game => game.gameId === message.gameId)
                if(game) {
                    let playerColor;

                    if(message.userId === game.player1Id) {
                        game.player1 = socket;
                        playerColor = "white"
                    }
                    else if(message.userId === game.player2Id) {
                        game.player2 = socket;
                        playerColor = "black"
                    }
                    else{
                        socket.send(JSON.stringify({
                            type: "ERROR",
                            message: "You are not a player in this game"
                        }))
                        return
                    }
                    
                    socket.send(JSON.stringify({
                        type: REJOIN_GAME,
                        payload: playerColor,
                        board: game.board.board()
                    }))

                }
            }
        })
    }
}