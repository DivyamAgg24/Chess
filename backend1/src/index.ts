import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv"
import { GameManager } from "./GameManager";

dotenv.config()

const PORT = parseInt(process.env.PORT || '8080')

const wss = new WebSocketServer({port: PORT})

const gameManager = new GameManager()

wss.on("connection", function connection(ws){
    gameManager.addUser(ws)
    ws.on('disconnect', () => gameManager.removeUser(ws))

})