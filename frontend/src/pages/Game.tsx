import { useEffect, useState } from "react"
import { Button } from "../components/ui/Button"
import { ChessBoard } from "../components/ChessBoard"
import { useSocket } from "../hooks/useSocket"
import { Chess } from "chess.js"
import { useAuth } from "../contexts/AuthContext"
import { useGameState } from "../hooks/useGameState"
import { useGameSocket } from "../hooks/useGameSocket"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Home, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
    const [_gameOver, setGameOver] = useState(false)
    const [_winner, setWinner] = useState("")
    const [piecesCaptured, setPiecesCaptured] = useState<{ white: string[], black: string[] }>({ white: [], black: [] })
    const [gameId, setGameId] = useState<string | null>(null);
    const { user, logout } = useAuth();
    const [opponentName, setOpponentName] = useState("")
    const [moveHistory, setMoveHistory] = useState<Array<{
        moveNumber: number,
        from: string,
        to: string,
        before: string,
        after: string,
        san?: string,
        captured?: string,
        timeTaken?: number
    }>>([])

    const [currentMoveIndex, setCurrentMoveIndex] = useState<number>(-1)
    const [_isViewingHistory, setIsViewingHistory] = useState(false)
    const [canMove, setCanMove] = useState(true)


    useEffect(() => {
        console.log("Pieces captured: ", piecesCaptured)
        console.log("Move History: ", JSON.stringify(moveHistory))
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
        setOpponentName,
        setMoveHistory,
        setIsViewingHistory,
        setCanMove,
        setCurrentMoveIndex
    })

    const navigate = useNavigate()

    const handleStartGame = () => {
        const userId = user?.id
        socket?.send(JSON.stringify({
            type: INIT_GAME,
            userId: userId
        }))
    }

    const goToStartingPosition = () => {
        setCurrentMoveIndex(-2) // Special value for starting position
        setIsViewingHistory(true)
        setCanMove(false)

        const startChess = new Chess()
        setChess(startChess)
        setBoard(startChess.board())
    }

    const goToPrevMove = () => {
        if (moveHistory.length === 0) return;
        let newIndex: number;
        if (currentMoveIndex === -1) {
            newIndex = moveHistory.length - 2
        }
        else if (currentMoveIndex === -2) {
            return
        }
        else {
            newIndex = currentMoveIndex - 1
        }

        if (newIndex < 0) {
            newIndex = -2
        }
        setCurrentMoveIndex(newIndex)
        setIsViewingHistory(true)
        setCanMove(false)

        if (newIndex === -2) {
            const startChess = new Chess()
            setChess(startChess)
            setBoard(startChess.board())
        } else {
            const targetFen = moveHistory[newIndex].after
            const historyChess = new Chess(targetFen)
            setChess(historyChess)
            setBoard(historyChess.board())
        }
    }


    const goToNextMove = () => {
        if (currentMoveIndex === -1 || moveHistory.length === 0) {
            return // Already at latest
        }

        let newIndex: number
        if (currentMoveIndex === -2) {
            // At starting position, go to first move
            newIndex = 0
        } else {
            newIndex = currentMoveIndex + 1
        }

        if (newIndex >= moveHistory.length - 1) {
            // Going to latest
            newIndex = -1
            setIsViewingHistory(false)
            setCanMove(true)
        } else {
            setIsViewingHistory(true)
            setCanMove(false)
        }

        setCurrentMoveIndex(newIndex)

        if (newIndex === -1) {
            // Latest position
            const latestFen = moveHistory[moveHistory.length - 1].after
            const latestChess = new Chess(latestFen)
            setChess(latestChess)
            setBoard(latestChess.board())
        } else {
            const targetFen = moveHistory[newIndex].after
            const historyChess = new Chess(targetFen)
            setChess(historyChess)
            setBoard(historyChess.board())
        }
    }

    const goToLatestMove = () => {
        if (moveHistory.length === 0) return

        setCurrentMoveIndex(-1)
        setIsViewingHistory(false)
        setCanMove(true)

        const latestFen = moveHistory[moveHistory.length - 1].after
        const latestChess = new Chess(latestFen)
        setChess(latestChess)
        setBoard(latestChess.board())
    }

    if (!socket) {
        return null
    }

    return <div className="flex justify-around max-h-screen h-screen overflow-y-auto">
        <div className="flex flex-col">
            {!started ?
                (<>
                    <div className="flex pt-5 items-center justify-between">
                        <div className="text-primary text-xl font-bold flex items-center gap-x-2">
                            <div className="">
                                <img src="/user-image.007dad08.svg" className="aspect-square h-7 rounded" />
                            </div>
                            <div>{user?.name}</div>
                        </div>
                        <div className="flex gap-x-3 items-center">
                            <Home className="cursor-pointer" onClick={() => navigate("/")} />
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 cursor-pointer" onClick={() => navigate("/profile")}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                            <Button size={"sm"} variant={"default"} onClick={logout} className="text-xs" ><LogOut /> Log Out</Button>
                        </div>
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
                    <div className="flex">
                        <div className="max-w-screen-lg w-full pt-5">
                            <div className="pb-2 text-primary font-bold flex items-center gap-x-3">
                                <div className="shrink-0">
                                    <img src="/user-image.007dad08.svg" className="aspect-square h-10 rounded" />
                                </div>
                                <div className="flex flex-col min-h-[3rem]">
                                    <div className="text-lg leading-tight">{opponentName}</div>
                                    <div className="text-base leading-tight flex">
                                        {piecesCaptured && playerColor === "white" ? (piecesCaptured.black || []).map((piece, index) => <img key={index} src={pieceImages['b' + piece]} className="h-5" />) : (piecesCaptured.white || []).map((piece, index) => <img key={index} src={pieceImages['w' + piece]} className="h-5" />)}
                                    </div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-10 gap-20">
                                <div className="col-span-6 shadow-xl">
                                    <ChessBoard board={board} chess={chess} socket={socket} playerColor={playerColor} canMove={canMove} />
                                </div>
                                
                                <div className="col-span-4">
                                    <div className="bg-primary text-primary-foreground">
                                        <div className="text-xl font-semibold py-2 px-3">Move History</div>
                                        <div className="space-y-1 max-h-32  overflow-y-scroll">
                                            {moveHistory.reduce<Array<{ white: any, black?: any, moveNum: number }>>((acc, move, index) => {
                                                // Group moves in pairs (white and black)
                                                if (index % 2 === 0) {
                                                    // White's move
                                                    acc.push({
                                                        white: move,
                                                        moveNum: Math.floor(index / 2) + 1
                                                    })
                                                } else {
                                                    // Black's move - add to the last pair
                                                    if (acc.length > 0) {
                                                        acc[acc.length - 1].black = move
                                                    }
                                                }
                                                return acc
                                            }, []).map((movePair, pairIndex) => (
                                                <div key={pairIndex} className={`grid grid-cols-12 py-1 gap-2 text-sm items-center px-3 ${pairIndex % 2 === 0 ? "bg-accent text-foreground" : "bg-primary"}`}>
                                                    <div className="col-span-2 pl-2">
                                                        {movePair.moveNum}.
                                                    </div>

                                                    <button
                                                        className={`col-span-5 text-left px-2 py-1 rounded hover:bg-muted hover:text-accent-foreground hover:ease-in hover:transition-all hover:duration-150 ${currentMoveIndex === movePair.white.moveNumber - 1 ? 'bg-muted text-accent-foreground' : ''
                                                            }`}
                                                        onClick={() => {
                                                            setCurrentMoveIndex(movePair.white.moveNumber - 1)
                                                            setIsViewingHistory(true)
                                                            setCanMove(false)
                                                            const chess = new Chess(movePair.white.after)
                                                            setChess(chess)
                                                            setBoard(chess.board())
                                                        }}
                                                    >
                                                        {movePair.white.san}
                                                    </button>

                                                    {/* Black's move */}
                                                    {movePair.black ? (
                                                        <button
                                                            className={`col-span-5 text-left px-2 my-1 py-1 rounded hover:bg-muted hover:text-accent-foreground hover:ease-inhover:transition-all hover:duration-150 ${currentMoveIndex === movePair.black.moveNumber - 1  ? 'bg-muted text-accent-foreground' : ''
                                                                }`}
                                                            onClick={() => {
                                                                setCurrentMoveIndex(movePair.black!.moveNumber - 1)
                                                                setIsViewingHistory(true)
                                                                setCanMove(false)
                                                                const chess = new Chess(movePair.black!.after)
                                                                setChess(chess)
                                                                setBoard(chess.board())
                                                            }}
                                                        >
                                                            {movePair.black.san}
                                                        </button>
                                                    ) : (
                                                        <div className="col-span-5"></div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="bg-secondary p-2">
                                        {moveHistory.length > 0 && (
                                            <div className="flex items-center justify-center gap-x-4">
                                                <Button
                                                    onClick={goToStartingPosition}
                                                    disabled={currentMoveIndex === -2}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <ChevronsLeft className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={goToPrevMove}
                                                    disabled={currentMoveIndex === -2}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <span className="text-sm text-center min-w-[80px]">
                                                    {currentMoveIndex === -2
                                                        ? "Start"
                                                        : currentMoveIndex === -1
                                                            ? `Move ${moveHistory.length}`
                                                            : `Move ${currentMoveIndex + 1}`
                                                    }
                                                </span>
                                                <Button
                                                    onClick={goToNextMove}
                                                    disabled={currentMoveIndex === -1 || currentMoveIndex === moveHistory.length-1}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    onClick={goToLatestMove}
                                                    disabled={currentMoveIndex === -1 || currentMoveIndex === moveHistory.length-1}
                                                    size="sm"
                                                    variant="outline"
                                                >
                                                    <ChevronsRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
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
                                        {piecesCaptured && playerColor === "white" ? (piecesCaptured.white || []).map((piece, index) => <img key={index} src={pieceImages['w' + piece]} className="h-5" />) : (piecesCaptured.black || []).map((piece, index) => <img key={index} src={pieceImages['b' + piece]} className="h-5" />)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>)
            }

        </div>
    </div>
}