import { useEffect, useState } from "react"
import { useAuth } from "../contexts/AuthContext"

export const useSocket = () => {
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const {user} = useAuth()
    
    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080")
        
        ws.onopen = () => {
            console.log("Connected")
            setSocket(ws)
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