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
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState("")

    useEffect(() => {
        if (!socket) {
            return 
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log("Received message:", message)
            
            switch (message.type) {
                case INIT_GAME:
                    console.log("Game initialised")
                    const newChess = new Chess()
                    setChess(newChess)
                    setBoard(newChess.board())
                    setPlayerColor(message.payload)
                    setStarted(true)
                    setGameOver(false)
                    setWinner("")
                    break
                    
                case MOVE:
                    const move = message.payload
                    console.log("Received move:", move)
                    
                    setChess(prevChess => {
                        try {
                            const newChess = new Chess(prevChess.fen())
                            
                            // Handle different move formats
                            let moveResult;
                            if (typeof move === 'string') {
                                moveResult = newChess.move(move)
                            } else if (move && typeof move === 'object') {
                                // For object moves, ensure proper format
                                const moveObj = {
                                    from: move.from,
                                    to: move.to,
                                    ...(move.promotion && { promotion: move.promotion })
                                }
                                console.log("Attempting move with object:", moveObj)
                                moveResult = newChess.move(moveObj)
                            }
                            
                            console.log("moveResult: ", moveResult)
                            
                            if (moveResult) {
                                console.log("Move applied successfully")
                                setBoard(newChess.board())
                                return newChess
                            } else {
                                console.error("Invalid move received from server:", move)
                                return prevChess
                            }
                        } catch (error) {
                            console.error("Error applying move:", error, "Move was:", move)
                            return prevChess
                        }
                    })
                    break
                    
                case GAME_OVER:
                    console.log("Game over received:", message)
                    
                    // Don't try to apply the final move again - it should already be applied
                    // The backend sends the final move in GAME_OVER just for reference
                    setGameOver(true)
                    setWinner(message.winner || message.turn)
                    
                    // Show game over message after state update
                    setTimeout(() => {
                        window.alert(`Game Over! ${message.winner || message.turn} wins!`)
                    }, 100)
                    break
                    
                default:
                    console.log("Unknown message type:", message.type)
            }
        }

        socket.onerror = (error) => {
            console.error("WebSocket error:", error)
        }

        socket.onclose = (event) => {
            console.log("WebSocket closed:", event)
            setStarted(false)
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