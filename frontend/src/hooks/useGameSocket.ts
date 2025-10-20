import { useEffect, useState } from "react"
import { Chess } from "chess.js"
import { INIT_GAME, MOVE, GAME_OVER, REJOIN_GAME } from "../pages/Game"

interface UseGameSocketProps {
    socket: WebSocket | null
    setChess: (chess: Chess | ((prev: Chess) => Chess)) => void
    setBoard: (board: any) => void
    setStarted: (started: boolean) => void
    setPlayerColor: (color: string) => void
    setGameOver: (gameOver: boolean) => void
    setWinner: (winner: string) => void
    setPiecesCaptured: (pieces: { white: string[], black: string[] } | ((prev: { white: string[], black: string[] }) => { white: string[], black: string[] })) => void
    setGameId: (gameId: string | null) => void
    setOpponentName: (opponentName: string) => void
}

export const useGameSocket = ({
    socket,
    setChess,
    setBoard,
    setStarted,
    setPlayerColor,
    setGameOver,
    setWinner,
    setPiecesCaptured,
    setGameId,
    setOpponentName
}: UseGameSocketProps) => {
    const [lastProcessedMove, setLastProcessedMove] = useState<string | null>(null)

    useEffect(() => {
        if (!socket) return

        const handleMessage = (event: MessageEvent) => {
            const message = JSON.parse(event.data)
            console.log("Received message:", message)

            switch (message.type) {
                case INIT_GAME:
                    console.log("Game initialised")
                    const newChess = new Chess()
                    setGameId(message.gameId)
                    setChess(newChess)
                    setBoard(newChess.board())
                    setPlayerColor(message.payload)
                    setStarted(true)
                    setGameOver(false)
                    setWinner("")
                    setOpponentName(message.opponentName)
                    break

                case MOVE:
                    handleMove(message.payload)
                    if (message.capturedByWhite && message.capturedByBlack) {
                        setPiecesCaptured({
                            white: message.capturedByWhite,
                            black: message.capturedByBlack
                        })
                    }
                    break

                case REJOIN_GAME:
                    console.log("Game rejoined")
                    if (message.gameState && message.gameState.fen) {
                        const restoredChess = new Chess(message.gameState.fen)
                        setChess(restoredChess)
                        setBoard(restoredChess.board())
                        setPlayerColor(message.payload)
                        setStarted(true)
                        setGameId(message.gameId)
                        setOpponentName(message.opponentName)

                        // Restore captured pieces if provided
                        if (message.gameState.capturedPieces) {
                            setPiecesCaptured(message.gameState.capturedPieces)
                        }
                    }
                    break

                case GAME_OVER:
                    console.log("Game over received:", message)
                    setGameOver(true)
                    setWinner(message.winner || message.turn)
                    // Clear game from storage when it ends
                    sessionStorage.removeItem('chess-game-id')
                    setTimeout(() => {
                        window.alert(`Game Over! ${message.winner || message.turn} wins!`)
                    }, 100)
                    break

                case "WAITING":
                    console.log("Waiting for opponent...")
                    // You might want to show a waiting indicator
                    break

                case "ERROR":
                    console.error("Server error:", message.message)
                    // Handle different types of errors
                    if (message.message.includes("Game not found")) {
                        sessionStorage.removeItem('chess-game-id')
                        setGameId(null)
                    }
                    break

                default:
                    console.log("Unknown message type:", message.type)
            }
        }

        const handleMove = (move: any) => {
            console.log("Received move:", move)
            const moveId = `${move.from}-${move.to}-${move.promotion || ''}`

            if (lastProcessedMove === moveId) {
                console.log("Duplicate move ignored:", moveId)
                return
            }

            setChess(prevChess => {
                try {
                    const newChess = new Chess(prevChess.fen())
                    let moveResult

                    if (typeof move === 'string') {
                        moveResult = newChess.move(move)
                    } else if (move && typeof move === 'object') {
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
                        setLastProcessedMove(moveId)
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
        }

        const handleError = (error: Event) => {
            console.error("WebSocket error:", error)
        }

        const handleClose = (event: CloseEvent) => {
            console.log("WebSocket closed:", event)
            setStarted(false)
        }

        socket.onmessage = handleMessage
        socket.onerror = handleError
        socket.onclose = handleClose

        // Cleanup
        return () => {
            if (socket) {
                socket.onmessage = null
                socket.onerror = null
                socket.onclose = null
            }
        }
    }, [socket, lastProcessedMove])
}