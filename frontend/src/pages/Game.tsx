import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"


export const Game = () => {
    const socket = useSocket()
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())
    const [started, setStarted] = useState(false)
    const [playerColor, setPlayerColor] = useState("")

    useEffect(() => {
        if (!socket){
            return 
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message)
            switch (message.type){
                case INIT_GAME:
                    console.log("Game initialised")
                    const newChess = new Chess()
                    setChess(newChess)
                    setBoard(newChess.board())
                    setPlayerColor(message.payload)
                    setStarted(true)
                    break
                case MOVE:
                    const move = message.payload
                    console.log("Received move:", move)
                    console.log("Turn before move:", chess.turn())
                    
                    setChess(prevChess => {
                        const newChess = new Chess(prevChess.fen())
                        const moveResult = newChess.move(move)
                        
                        if (moveResult) {
                            console.log("Move applied successfully")
                            console.log("Turn after move:", newChess.turn())
                            setBoard(newChess.board())
                            return newChess
                        } else {
                            console.error("Invalid move:", move)
                            return prevChess
                        }
                    })
                    break
                case GAME_OVER:
                    console.log("Game over")
                    window.alert("Game over " + message.payload + " wins")
                    break
            }
        }
    }, [socket])

    if (!socket){
        return <div>
            Connecting...
        </div>
    }
    return <div className="flex justify-center max-h-screen h-screen overflow-y-auto">
        <div className="max-w-screen-lg w-full pt-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="col-span-4">
                    <ChessBoard board={board} chess={chess} socket={socket} playerColor={playerColor} />
                </div>
                <div className="col-span-2">
                    {!started && <Button onClick={()=>{
                        socket.send(JSON.stringify({
                            type: INIT_GAME
                        }))
                    }}>
                        Play
                    </Button>}
                </div>
            </div>
        </div>
    </div>
}