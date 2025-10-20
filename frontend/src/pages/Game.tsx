import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"
import { useAuth } from "../contexts/AuthContext"
import { useGameState } from "../hooks/useGameState"
import { useGameSocket } from "../hooks/useGameSocket"

export const INIT_GAME = "init_game"
export const MOVE = "move"
export const GAME_OVER = "game_over"
export const REJOIN_GAME = "rejoin_game"

const pieceImages: Record<string, string> = {
    wp: "/pieces/wp.svg",
    wr: "/pieces/wr.svg",
    wn: "/pieces/wn.svg",
    wb: "/pieces/wb.svg",
    wq: "/pieces/wq.svg",
    wk: "/pieces/wk.svg",
    bp: "/pieces/bp.svg",
    br: "/pieces/br.svg",
    bn: "/pieces/bn.svg",
    bb: "/pieces/bb.svg",
    bq: "/pieces/bq.svg",
    bk: "/pieces/bk.svg",
};


export const Game = () => {
    const socket = useSocket()
    const [chess, setChess] = useState(new Chess())
    const [board, setBoard] = useState(chess.board())
    const [started, setStarted] = useState(false)
    const [playerColor, setPlayerColor] = useState("")
    const [gameOver, setGameOver] = useState(false)
    const [winner, setWinner] = useState("")
    const [piecesCaptured, setPiecesCaptured] = useState<{ white: string[], black: string[] }>({ white: [], black: [] })
    const [gameId, setGameId] = useState<string | null>(null);
    const { user } = useAuth();
    const [opponentName, setOpponentName] = useState("")


    useEffect(() => {
        console.log("Pieces captured: ", piecesCaptured)
        console.log("Player color:" + playerColor)
    }, [piecesCaptured])


    useGameState({
        socket,
        gameId,
        setGameId
    })

    useGameSocket({
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
    })


    const handleStartGame = () => {
        const userId = user?.id
        socket?.send(JSON.stringify({
            type: INIT_GAME,
            userId: userId
        }))
    }

    if (!socket) {
        return null
    }

    return <div className="flex justify-around max-h-screen h-screen overflow-y-auto">
        <div className="flex flex-col">
            {!started ?
                (<>
                    <div className="pt-5 text-primary text-xl font-bold flex items-center gap-x-2">
                        <div className="">
                            <img src="/user-image.007dad08.svg" className="aspect-square h-7 rounded" />
                        </div>
                        <div>{user?.name}</div>
                    </div>
                    <div className="max-w-screen-lg w-full pt-12">
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-20">
                            <div className={`${started ? "col-span-5" : " col-span-4"} shadow-xl`}>
                                <ChessBoard board={board} chess={chess} socket={socket} playerColor={playerColor} />
                            </div>
                            <div className="col-span-2">
                                <Button onClick={handleStartGame}
                                    className="text-[hsl(var(--primary-foreground))] text-lg" size={"lg"}>
                                    Play
                                </Button>
                            </div>
                        </div>
                    </div>
                </>) :
                (<>
                    <div className="max-w-screen-lg w-full pt-5">
                        <div className="pb-5 text-primary font-bold flex items-center gap-x-3">
                            <div className="shrink-0">
                                <img src="/user-image.007dad08.svg" className="aspect-square h-10 rounded" />
                            </div>
                            <div className="flex flex-col min-h-[3rem]">
                                <div className="text-lg leading-tight">{opponentName}</div>
                                <div className="text-base leading-tight flex">
                                    {piecesCaptured && playerColor === "white" ? (piecesCaptured.black || []).map((piece, index)=> <img src={pieceImages['b' + piece]} className="h-5"/> ): (piecesCaptured.white || []).map((piece, index)=> <img src={pieceImages['w' + piece]} className="h-5"/> )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-20">
                            <div className="col-span-4 shadow-xl">
                                <ChessBoard board={board} chess={chess} socket={socket} playerColor={playerColor} />
                            </div>
                        </div>
                        <div className="pt-5 text-primary font-bold flex items-center gap-x-3">
                            <div className="shrink-0">
                                <img src="/user-image.007dad08.svg" className="aspect-square h-10 rounded" />
                            </div>
                            <div className="flex flex-col min-h-[3rem]">
                                <div className="text-lg leading-tight">
                                    {user?.name}
                                </div>
                                <div className="text-base leading-tight flex">
                                    {piecesCaptured && playerColor === "white" ? (piecesCaptured.white || []).map((piece, index)=> <img src={pieceImages['w' + piece]} className="h-5"/> ) : (piecesCaptured.black || []).map((piece, index)=> <img src={pieceImages['b' + piece]} className="h-5"/> )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>)
            }

        </div>
    </div>
}