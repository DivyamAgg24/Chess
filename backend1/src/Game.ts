import WebSocket from "ws"
import {Chess} from "chess.js"
import { GAME_OVER, INIT_GAME, MOVE } from "./messages"
import { db } from "./db"

interface Move {
    from: string, 
    to: string,
    promotion? :string
}

export class Game {
    public player1 : WebSocket
    public player2 : WebSocket
    private board : Chess
    private moves : Move[]

    constructor(player1: WebSocket, player2: WebSocket){
        this.player1 = player1
        this.player2 = player2
        this.board = new Chess()
        this.moves = []
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: "white"
        }))
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: "black"
        }))
    }

    makeMove(socket: WebSocket, move: Move) {
        if (this.moves.length % 2 == 0 && socket !== this.player1){
            return
        }

        if (this.moves.length % 2 == 1 && socket !== this.player2){
            return
        }
        try{
            this.board.move(move)
            this.moves.push(move)
            console.log(this.board.ascii())
        } catch(e) {
            console.log(e)
            return
        }
        this.player2.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))
    
        this.player1.send(JSON.stringify({
            type: MOVE,
            payload: move
        }))

        if (this.board.isGameOver()){
            let winner = this.board.turn() === "w" ? "black" : "white";
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                winner: winner,
                turn : this.board.turn() === "w" ? "black" : "white",
                payload: move
            }))
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                winner: winner,
                turn : this.board.turn() === "w" ? "black" : "white",
                payload: move
            }))
            return
        }

        
        
    }
}