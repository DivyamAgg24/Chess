import { useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { REJOIN_GAME } from "../pages/Game"

interface UseGameStateProps {
    socket: WebSocket | null
    gameId: string | null
    setGameId: (gameId: string | null) => void
}

export const useGameState = ({
    socket,
    gameId,
    setGameId
}: UseGameStateProps) => {

    const { user } = useAuth()

    // Save game state to sessionStorage
    useEffect(() => {
        if (gameId) {
            sessionStorage.setItem('chess-game-id', gameId)
        }
    }, [gameId])

    // Restore game state from sessionStorage
    useEffect(() => {
        const savedGameId = sessionStorage.getItem('chess-game-id')
        const userId = user?.id
        if (savedGameId && userId && socket) {
            try {
                console.log('Attempting to rejoin game:', savedGameId)
                // Send rejoin request to backend
                socket.send(JSON.stringify({
                    type: REJOIN_GAME,
                    gameId: savedGameId,
                    userId: userId
                }))
            } catch (error) {
                console.error('Error rejoining game:', error)
            }
        }
    }, [socket, user])

    const clearGameState = () => {
        sessionStorage.removeItem('chess-game-id')
        setGameId(null)
    }

    return { clearGameState }
}