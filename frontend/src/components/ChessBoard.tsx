import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../pages/Game";

export const ChessBoard = ({ board, chess, socket, playerColor }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    chess: Chess, socket: WebSocket, playerColor: string
}) => {

    const [from, setFrom] = useState<Square | null>(null)
    const [to, setTo] = useState<Square | null>(null)
    const [moves, setMoves] = useState<String[] | Move[] | null>(null)

    useEffect(() => {
        console.log("Moves ", moves)
    }, [moves])

    return <div className="flex">
        <div className="text-white grid grid-rows-8">
            {(playerColor === "black" ? [...board].reverse() : board).map((row, i) => {
                const actualRowIndex = playerColor === "black" ? (7 - i) : i;
                return <div key={i} className={`grid grid-cols-8`}>
                    {(playerColor === "black" ? [...row].reverse() : row).map((square, j) => {
                        const actualColumnIndex = playerColor === "black" ? (7 - j) : j;

                        // Square representation should ONLY be the coordinate (e.g., "d6", "c6")
                        const squareRepresentation = String.fromCharCode(97 + (actualColumnIndex % 8)) + "" + (8 - (actualRowIndex % 8)) as Square;

                        // Check if this square is a valid move destination
                        const isValidMove = moves?.some(move => {
                            if (typeof move === "string") {
                                // For string moves like "d6", "dxc6", "Qe2", etc.
                                // Extract the destination square from the move notation
                                const moveStr = move as string;

                                // Handle captures (e.g., "dxc6" -> "c6")
                                if (moveStr.includes('x')) {
                                    let destSquare = moveStr.split('x')[1];

                                    if (destSquare.includes('+')) {
                                        destSquare = destSquare.split('+')[0];
                                        return destSquare === squareRepresentation;
                                    }
                                    return destSquare === squareRepresentation;
                                }


                                // Handle piece moves (e.g., "Qe2" -> "e2")
                                if (moveStr.includes('+')) {
                                    let destSquare = moveStr.split('+')[0];
                                    if (destSquare.length >= 2) {
                                        destSquare = destSquare.slice(-2);
                                        return destSquare === squareRepresentation;
                                    }
                                    return destSquare === squareRepresentation;
                                }
                                if (moveStr.includes('#')) {
                                    let destSquare = moveStr.split('#')[0];
                                    if (destSquare.length >= 2) {
                                        destSquare = destSquare.slice(-2);
                                        return destSquare === squareRepresentation;
                                    }
                                    return destSquare === squareRepresentation;
                                }

                                if (moveStr.length >= 2) {
                                        const destSqr = moveStr.slice(-2);
                                        return destSqr === squareRepresentation;
                                    }

                                // Handle pawn moves (e.g., "d6" -> "d6")
                                return moveStr === squareRepresentation;
                            } else {
                                // For Move objects, check the 'to' property
                                return move.to === squareRepresentation;
                            }
                        });

                        const canSelectPiece = square &&
                            ((playerColor === "white" && square.color === "w") ||
                                (playerColor === "black" && square.color === "b"));

                        return <div key={j} onClick={() => {
                            if (!from) {
                                if (canSelectPiece) {
                                    console.log("Selected square:", squareRepresentation);
                                    const possibleMoves = chess.moves({ square: squareRepresentation });
                                    console.log("Possible moves:", possibleMoves);
                                    setMoves(possibleMoves);
                                    setFrom(squareRepresentation);
                                }
                            }
                            else {
                                if (isValidMove) {
                                    console.log("Making move:", { from, to: squareRepresentation });
                                    socket.send(JSON.stringify({
                                        type: MOVE,
                                        move: {
                                            from,
                                            to: squareRepresentation
                                        }
                                    }));
                                    setFrom(null);
                                    setMoves(null);
                                } else {
                                    // Check if clicking on another piece of same color
                                    if (canSelectPiece) {
                                        console.log("Switching to piece:", squareRepresentation);
                                        const possibleMoves = chess.moves({ square: squareRepresentation });
                                        setMoves(possibleMoves);
                                        setFrom(squareRepresentation);
                                    } else {
                                        console.log("Invalid move, clearing selection");
                                        setFrom(null);
                                        setMoves(null);
                                    }
                                }
                            }
                        }}
                            className={`w-16 h-16 ${(actualRowIndex + actualColumnIndex) % 2 === 0 ? 'bg-green-600' : 'bg-amber-200'}`}>
                            <div className={`h-full w-full ${from === squareRepresentation ? 'bg-lime-500' : ''} ${canSelectPiece ? 'cursor-pointer' : ''}`}>
                                <div className="flex flex-col justify-center h-full w-full">
                                    <div className={`flex justify-center rounded-full `}>
                                        <div className={`flex flex-col justify-center p-3 ${isValidMove ? 'bg-black/20 rounded-full' : ''}`}>
                                            {square ? <img src={`${square.color === 'b' ? `./${square.type}.png` : `./${square?.type.toUpperCase()} copy.png`}`} className="w-6" /> : null}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            })}
        </div>
    </div>
}