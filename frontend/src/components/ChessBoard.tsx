import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../pages/Game";

export const ChessBoard = ({board, chess, socket} : {board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    chess: Chess, socket: WebSocket
}) => {

    const [from, setFrom] = useState<Square | null>(null)
    const [to, setTo] = useState<Square | null>(null)
    const [moves, setMoves] = useState<String[] | Move[] | null>(null)

    return <div className="text-white">
        {board.map((row, i) => {
            return <div key={i} className="flex">
                {row.map((square, j) => {
                    const squareRepresentation = String.fromCharCode(97 + (j % 8)) + "" + (8 - ( i % 8)) as Square
                    // console.log(square?.square, squareRepresentation)
                    return <div key={j} onClick={()=>{
                        if (!from){
                            setMoves(chess.moves({square: squareRepresentation}))
                            setFrom(squareRepresentation)
                        }
                        else{
                            if (moves?.map(move => move === squareRepresentation)){
                                socket.send(JSON.stringify({
                                    type:MOVE,
                                    move: {
                                        from,
                                        to: squareRepresentation
                                    }
                                }))
                                console.log(moves)
                                console.log({
                                    from,
                                    to: squareRepresentation
                                })
                                setFrom(null)
                            }
                            else{
                                console.log("Invalid move")
                            }
                        }
                    }} 
                    className={`w-16 h-16 ${(i+j)%2 === 0 ? 'bg-green-500': 'bg-green-300'}`}>
                        <div className="h-full w-full flex justify-center">
                            <div className="h-full flex flex-col justify-center">
                                {square ? <img src={`${square.color === 'b' ? `./${square.type}.png` : `./${square?.type.toUpperCase()} copy.png`}`} className=" w-4"/> : null}
                            </div>

                        </div>
                    </div>
                })}
            </div>
        })}        
    </div>
}