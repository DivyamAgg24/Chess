import { useAuth } from "../contexts/AuthContext"
import { Button } from "./ui/Button"; 

export const Topbar = () => {
    const {logout} = useAuth();

    return <div className="bg-card">
        <Button onClick={logout}>Logout</Button>
    </div>
}