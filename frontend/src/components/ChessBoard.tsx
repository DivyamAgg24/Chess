import { Chess, Color, Move, PieceSymbol, Square } from "chess.js";
import { useEffect, useState } from "react";
import { MOVE } from "../pages/Game";

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

export const ChessBoard = ({ board, chess, socket, playerColor }: {
    board: ({
        square: Square;
        type: PieceSymbol;
        color: Color;
    } | null)[][],
    chess: Chess,
    socket: WebSocket,
    playerColor: string
}) => {

    const [from, setFrom] = useState<Square | null>(null);
    const [_to, setTo] = useState<Square | null>(null);
    const [moves, setMoves] = useState<String[] | Move[] | null>(null);
    const [showPromotionDialog, setShowPromotionDialog] = useState(false);
    const [promotionSquare, setPromotionSquare] = useState<Square | null>(null);

    useEffect(() => {
        console.log("Moves ", moves);
    }, [moves]);

    const extractDestinationSquare = (moveStr: string): string => {
        // Handle captures (e.g., "dxc6" -> "c6")
        if (moveStr.includes('x')) {
            let destSquare = moveStr.split('x')[1];

            // Remove check/checkmate symbols
            if (destSquare.includes('+')) {
                destSquare = destSquare.split('+')[0];
            }
            if (destSquare.includes('#')) {
                destSquare = destSquare.split('#')[0];
            }
            // Remove promotion notation
            if (destSquare.includes("=")) {
                destSquare = destSquare.split('=')[0];
            }
            return destSquare;
        }

        // Remove check/checkmate symbols
        if (moveStr.includes('+')) {
            let destSquare = moveStr.split('+')[0];
            if (destSquare.includes('=')) {
                destSquare = destSquare.split('=')[0];
            }
            if (destSquare.length >= 2) {
                destSquare = destSquare.slice(-2);
            }
            return destSquare;
        }

        if (moveStr.includes('#')) {
            let destSquare = moveStr.split('#')[0];
            if (destSquare.includes('=')) {
                destSquare = destSquare.split('=')[0];
            }
            if (destSquare.length >= 2) {
                destSquare = destSquare.slice(-2);
            }
            return destSquare;
        }

        // Handle promotion
        if (moveStr.includes("=")) {
            let destSquare = moveStr.split('=')[0];
            return destSquare;
        }

        // Handle regular piece moves (e.g., "Qe2" -> "e2")
        if (moveStr.length >= 2) {
            const destSqr = moveStr.slice(-2);
            return destSqr;
        }

        return moveStr;
    };

    const isPromotionMove = (moveStr: string): boolean => {
        return moveStr.includes('=');
    };

    const handlePromotion = (piece: string) => {
        if (from && promotionSquare) {
            socket.send(JSON.stringify({
                type: MOVE,
                move: {
                    from,
                    to: promotionSquare,
                    promotion: piece.toLowerCase()
                }
            }));
            setFrom(null);
            setMoves(null);
            setTo(null);
            setShowPromotionDialog(false);
            setPromotionSquare(null);
        }
    };

    return <div className="flex">
        <div className="text-white grid grid-rows-8">
            {(playerColor === "black" ? [...board].reverse() : board).map((row, i) => {
                const actualRowIndex = playerColor === "black" ? (7 - i) : i;

                return <div key={i} className={`grid grid-cols-8`}>
                    {(playerColor === "black" ? [...row].reverse() : row).map((square, j) => {
                        const actualColumnIndex = playerColor === "black" ? (7 - j) : j;

                        const squareRepresentation = String.fromCharCode(97 + (actualColumnIndex % 8)) + "" + (8 - (actualRowIndex % 8)) as Square;

                        // Check if this square is a valid move destination
                        const isValidMove = moves?.some(move => {
                            if (typeof move === "string") {
                                const destSquare = extractDestinationSquare(move);
                                return destSquare === squareRepresentation;
                            }
                        });

                        const canSelectPiece = square &&
                            ((playerColor === "white" && square.color === "w") ||
                                (playerColor === "black" && square.color === "b"));

                        // Check if any of the possible moves to this square is a promotion
                        const hasPromotionMove = moves?.some(move => {
                            if (typeof move === "string") {
                                const destSquare = extractDestinationSquare(move);
                                return destSquare === squareRepresentation && isPromotionMove(move);
                            }
                            return false;
                        });

                        return (
                            <div key={j}
                                onClick={() => {
                                    if (!from) {
                                        if (canSelectPiece) {
                                            console.log("Selected square:", squareRepresentation);
                                            const possibleMoves = chess.moves({ square: squareRepresentation });
                                            setMoves(possibleMoves);
                                            setFrom(squareRepresentation);
                                        }
                                    } else {
                                        if (isValidMove) {
                                            setTo(squareRepresentation);
                                            console.log("Making move:", { from, to: squareRepresentation });

                                            // Check if the curret move is a promotion move
                                            if (hasPromotionMove) {
                                                setPromotionSquare(squareRepresentation);
                                                setShowPromotionDialog(true);
                                            } else {
                                                socket.send(JSON.stringify({
                                                    type: MOVE,
                                                    move: {
                                                        from,
                                                        to: squareRepresentation
                                                    }
                                                }));
                                                setFrom(null);
                                                setMoves(null);
                                                setTo(null);
                                            }
                                        } else {
                                            // Check if clicking on another piece of same color
                                            if (canSelectPiece) {
                                                console.log("Switching to piece:", squareRepresentation);
                                                const possibleMoves = chess.moves({ square: squareRepresentation });
                                                setMoves(possibleMoves);
                                                setFrom(squareRepresentation);
                                                setPromotionSquare(null);
                                                setShowPromotionDialog(false);
                                            } else {
                                                console.log("Invalid move, clearing selection");
                                                setFrom(null);
                                                setMoves(null);
                                                setTo(null);
                                            }
                                        }
                                    }
                                }}
                                className={`w-16 h-16 ${(actualRowIndex + actualColumnIndex) % 2 === 0 ? 'bg-[#3f822b]' : 'bg-[#d2cea2]'} relative`}
                            >
                                <div className={`h-full w-full ${from === squareRepresentation ? 'bg-lime-500' : ''} ${canSelectPiece ? 'cursor-pointer' : ''}`}>

                                    {showPromotionDialog && promotionSquare === squareRepresentation && (
                                        <div className="absolute top-0 left-0 z-10 flex flex-col border bg-white text-black text-xs">
                                            <button onClick={(e) => { e.stopPropagation(); handlePromotion('q') }} className="p-1 hover:bg-gray-200">Queen</button>
                                            <button onClick={(e) => { e.stopPropagation(); handlePromotion('r') }} className="p-1 hover:bg-gray-200">Rook</button>
                                            <button onClick={(e) => { e.stopPropagation(); handlePromotion('b') }} className="p-1 hover:bg-gray-200">Bishop</button>
                                            <button onClick={(e) => { e.stopPropagation(); handlePromotion('n') }} className="p-1 hover:bg-gray-200">Knight</button>
                                        </div>
                                    )}

                                    <div className="flex flex-col justify-center h-full w-full">
                                        <div className={`flex justify-center rounded-full`}>
                                            <div className={`flex flex-col justify-center p-3 ${isValidMove ? 'bg-black/20 rounded-full' : ''}`}>
                                                {square ? (
                                                    <img
                                                        src={pieceImages[square.color + square.type]}
                                                        className="w-12 h-12"
                                                        alt={`${square.color}${square.type}`}
                                                    />
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            })}
        </div>
    </div>
}