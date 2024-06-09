import React from 'react';
import Figure from "../components/Figure"
import "../components/Chessboard.css"

class Piece {
    constructor(image, x, y) {
        this.image = image;
        this.x = x;
        this.y = y
    }
}

const pieces = [];
for(let i=0; i<8; i++) {
    pieces.push(new Piece("images/pawn_b.png", i, 6)); 
    pieces.push(new Piece("images/pawn_w.png", i, 1))
}
// Black pieces on chessboard
pieces.push(new Piece("images/rook_b.png", 0, 7))
pieces.push(new Piece("images/rook_b.png", 7, 7))
pieces.push(new Piece("images/knight_b.png", 1, 7))
pieces.push(new Piece("images/knight_b.png", 6, 7))
pieces.push(new Piece("images/bishop_b.png", 2, 7))
pieces.push(new Piece("images/bishop_b.png", 5, 7))
pieces.push(new Piece("images/queen_b.png", 3, 7))
pieces.push(new Piece("images/king_b.png", 4, 7))

// White pieces on chessboard
pieces.push(new Piece("images/rook_w.png", 0, 0))
pieces.push(new Piece("images/rook_w.png", 7, 0))
pieces.push(new Piece("images/knight_w.png", 1, 0))
pieces.push(new Piece("images/knight_w.png", 6, 0))
pieces.push(new Piece("images/bishop_w.png", 2, 0))
pieces.push(new Piece("images/bishop_w.png", 5, 0))
pieces.push(new Piece("images/queen_w.png", 3, 0))
pieces.push(new Piece("images/king_w.png", 4, 0))

console.log(pieces);

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g","h"]
let key = 0;

function Chessboard() 
{
    let board = [];

    for(let j=verticalAxis.length-1; j>=0; j--)
    {
        for(let i=0; i<horizontalAxis.length; i++)
        {
            const number = j + i + 2;
            let image = null;

            pieces.forEach(p => {
                if(p.x === i && p.y === j) {
                    image = p.image;
                }
            })

            board.push(<Figure image={image} number={number} key={key} />)
            key++;
        }
    }

    return (
    <div id="chessboard">
        {board}
    </div>
    )
}

export default Chessboard;