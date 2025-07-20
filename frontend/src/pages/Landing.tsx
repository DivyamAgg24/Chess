import { useNavigate } from "react-router-dom"
import { Button } from "../components/Button"

export const Landing = () => {

    const navigate = useNavigate()

    return <div className="flex justify-center ">
        <div className="max-w-screen-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="m-3 flex justify-center">
                    <img src={"./chessboard.png"} className="w-full h-auto"/>
                </div>
                <div className="mt-10 text-white gap-y-4">
                    <div className="font-bold text-4xl flex justify-center">
                        <h1>
                            Play Chess on the best platform
                        </h1>
                    </div>
                    <div className="mt-4 flex justify-center">
                        <Button onClick={()=>{navigate("/game")}}>Play Online</Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}