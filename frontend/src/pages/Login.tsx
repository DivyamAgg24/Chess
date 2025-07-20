import { useState } from "react"
import { useNavigate } from "react-router-dom"

const BACKEND_URL = import.meta.env.HTTP_BACKEND_URL ?? "http://localhost:8000"
console.log(BACKEND_URL)
export const Login = () => {
    const [username, setUsername] = useState('')
    const navigate = useNavigate()
    const guestLogin = async () => {
        const response = await fetch(`${BACKEND_URL}/auth/guest`, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            credentials: "include",
            body: JSON.stringify({
                name: username || ""
            })
        })
        const user = await response.json()
        console.log( "User" ,user)
        navigate("/")
    }
    return <div className="flex h-full justify-center bg-gray-900 text-white">
        <div className="flex flex-col justify-center">
            <div className="flex flex-col border p-5 rounded">
                <input className="border-2 rounded px-1 " placeholder="username" onChange={(e)=>{setUsername(e.target.value)}} />
                <button className="mt-2 border px-2" onClick={guestLogin}>Signup</button>
            </div>
        </div>
    </div>
}