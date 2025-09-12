import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"
import { useAuth } from "../contexts/AuthContext"
import axios from "axios"

const BACKEND_URL = import.meta.env.VITE_HTTP_BACKEND_URL
console.log(BACKEND_URL)
export const Login = () => {
    const navigate = useNavigate()
    const {login} = useAuth();

    const guestLogin = async () => {
        const response = await axios.post(`${BACKEND_URL}/auth/guest`, {
            credentials: "include",
        })
        const {user} = response.data
        console.log("User", user)
        navigate("/game")
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