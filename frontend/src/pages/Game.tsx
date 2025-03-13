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
                    setChess(new Chess())
                    setBoard(chess.board())
                    setStarted(true)
                    break
                case MOVE:
                    console.log('here')
                    const move = message.payload
                    chess.move(move)
                    setBoard(chess.board())
                    console.log("Piece Moved")
                    break
                case GAME_OVER:
                    console.log("Game over")
                    break
            }
        }
    }, [socket])

    if (!socket){
        return <div>
            Connecting...
        </div>
    }
    return <div className="flex justify-center">
        <div className="max-w-screen-lg w-full pt-8">
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                <div className="col-span-4">
                    <ChessBoard board={board} chess={chess} socket={socket}/>
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