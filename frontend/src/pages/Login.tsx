import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

const BACKEND_URL = import.meta.env.VITE_HTTP_BACKEND_URL
console.log(BACKEND_URL)
export const Login = () => {
    const navigate = useNavigate()
    const { login, refreshUser } = useAuth();

    const guestLogin = async () => {
        try {
            const response = await axios.post(`/api/auth/guest`, {
                withCredentials: true
            })
            if (response.status === 200) {
                await refreshUser()
                navigate("/game")
            }
        } catch (error) {
            console.error("Error creating guest account:", error)
       }
    }
    return <div className="flex h-full justify-center bg-background text-foreground">
        <div className="flex flex-col justify-center ">
            <div className="flex flex-col border shadow-lg p-5 rounded-lg gap-y-3">
                <Button
                    onClick={guestLogin}
                    className="bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] hover:bg-primary/90 text-lg font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                    Play As Guest
                </Button>
                <div className="flex justify-center text-black font-medium">Or</div>
                <Button className="bg-background border text-black hover:bg-background font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" onClick={login}>
                    <img src="/googleLogo.jpg" className="h-3 w-3" />
                    <div> Sign In with Google</div>
                </Button>
            </div>
        </div>
    </div>
}