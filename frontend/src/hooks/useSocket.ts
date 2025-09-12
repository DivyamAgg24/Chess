import { useEffect, useState } from "react"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080")
        
        ws.onopen = () => {
            console.log("Connected")
            setSocket(ws)
            
            // Auto-rejoin game if there's saved state
            const savedState = sessionStorage.getItem('chess-game-state')
            if (savedState) {
                const { gameId } = JSON.parse(savedState)
                const userId = sessionStorage.getItem("userId")
                console.log(userId)
                if (gameId && userId) {
                    ws.send(JSON.stringify({
                        type: "rejoin_game",
                        gameId,
                        userId
                    }))
                }
            }
        }
        
        ws.onclose = () => {
            console.log("disconnected")
            setSocket(null)
        }

        return () => {
            ws.close()
        }
    }, [])

    return socket
}