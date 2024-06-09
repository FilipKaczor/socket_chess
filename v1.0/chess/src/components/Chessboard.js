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
for(let i=0; i<2; i++)
{
    const type = (i===0) ? 'b':'w';
    const num = (i===0) ? 7:0;

    pieces.push(new Piece(`images/rook_${type}.png`, 0, num));
    pieces.push(new Piece(`images/rook_${type}.png`, 7, num));
    pieces.push(new Piece(`images/knight_${type}.png`, 1, num));
    pieces.push(new Piece(`images/knight_${type}.png`, 6, num));
    pieces.push(new Piece(`images/bishop_${type}.png`, 2, num));
    pieces.push(new Piece(`images/bishop_${type}.png`, 5, num));
    pieces.push(new Piece(`images/queen_${type}.png`, 3, num));
    pieces.push(new Piece(`images/king_${type}.png`, 4, num));

}

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