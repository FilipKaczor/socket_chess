import React, { useEffect, useState } from 'react';
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

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g","h"]

let activePiece = null;

function grabFigure(e) {
    let element = e.target;

    if(element.classList.contains("chesspiece"))
    {
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        element.style.position = "absolute";
        element.style.left = `${x}px`;
        element.style.top = `${y}px`;
        console.log(element);

        activePiece = element;
    }
}

function moveFigure(e) {
    if(activePiece && activePiece.classList.contains("chesspiece"))
    {
        const x = e.clientX - 50;
        const y = e.clientY - 50;
        activePiece.style.position = "absolute";
        activePiece.style.left = `${x}px`;
        activePiece.style.top = `${y}px`;
    }
}

function Chessboard(props) 
{
    let firstRenderBoard = [];
    for(let i=0; i<8; i++)
    {
        firstRenderBoard[i] = [];
        for(let j=0; j<8; j++)
        {
            firstRenderBoard[i][j] = "";
        }
    }
    //Definiowanie tablicy (inna dla gracza 1 i inna dla gracza 2)
    if(props.player_number == 1)
    {
        for(let i=0; i<8; i++) {
        pieces.push(new Piece("images/pawn_b.png", i, 6)); 
        firstRenderBoard[6][i] = "images/pawn_b.png";
        pieces.push(new Piece("images/pawn_w.png", i, 1))
        firstRenderBoard[1][i] = "images/pawn_w.png";
        }
        for(let i=0; i<2; i++)
        {
            const type = (i===0) ? 'b':'w';
            const num = (i===0) ? 7:0;
        
            pieces.push(new Piece(`images/rook_${type}.png`, 0, num));
            firstRenderBoard[num][0] = `images/rook_${type}.png`;

            pieces.push(new Piece(`images/rook_${type}.png`, 7, num));
            firstRenderBoard[num][7] = `images/rook_${type}.png`;

            pieces.push(new Piece(`images/knight_${type}.png`, 1, num));
            firstRenderBoard[num][1] = `images/knight_${type}.png`;

            pieces.push(new Piece(`images/knight_${type}.png`, 6, num));
            firstRenderBoard[num][6] = `images/knight_${type}.png`;

            pieces.push(new Piece(`images/bishop_${type}.png`, 2, num));
            firstRenderBoard[num][2] = `images/bishop_${type}.png`;

            pieces.push(new Piece(`images/bishop_${type}.png`, 5, num));
            firstRenderBoard[num][5] = `images/bishop_${type}.png`;

            pieces.push(new Piece(`images/queen_${type}.png`, 3, num));
            firstRenderBoard[num][3] = `images/queen_${type}.png`;

            pieces.push(new Piece(`images/king_${type}.png`, 4, num));
            firstRenderBoard[num][4] = `images/king_${type}.png`;

        }
    }
    else
    {
        for(let i=0; i<8; i++) {
            pieces.push(new Piece("images/pawn_b.png", i, 1));
            firstRenderBoard[1][i] = "images/pawn_b.png";
            pieces.push(new Piece("images/pawn_w.png", i, 6));
            firstRenderBoard[6][i] = "images/pawn_w.png";
        }
        for(let i=0; i<2; i++)
        {
            const type = (i===0) ? 'w':'b';
            const num = (i===0) ? 7:0;
        
            pieces.push(new Piece(`images/rook_${type}.png`, 0, num));
            firstRenderBoard[num][0] = `images/rook_${type}.png`;

            pieces.push(new Piece(`images/rook_${type}.png`, 7, num));
            firstRenderBoard[num][7] = `images/rook_${type}.png`;

            pieces.push(new Piece(`images/knight_${type}.png`, 1, num));
            firstRenderBoard[num][1] = `images/knight_${type}.png`;

            pieces.push(new Piece(`images/knight_${type}.png`, 6, num));
            firstRenderBoard[num][6] = `images/knight_${type}.png`;

            pieces.push(new Piece(`images/bishop_${type}.png`, 2, num));
            firstRenderBoard[num][2] = `images/bishop_${type}.png`;

            pieces.push(new Piece(`images/bishop_${type}.png`, 5, num));
            firstRenderBoard[num][5] = `images/bishop_${type}.png`;

            pieces.push(new Piece(`images/queen_${type}.png`, 3, num));
            firstRenderBoard[num][3] = `images/queen_${type}.png`;

            pieces.push(new Piece(`images/king_${type}.png`, 4, num));
            firstRenderBoard[num][4] = `images/king_${type}.png`;
        } 
    }
    const [getBoard,setBoard]=useState(firstRenderBoard)
    // useEffect()

    let board = [];

    for(let j=verticalAxis.length-1; j>=0; j--)
    {
        for(let i=0; i<horizontalAxis.length; i++)
        {
            const number = j + i + 2;
            let image = firstRenderBoard[j][i];

            board.push(<Figure image={image} number={number} key={`${j},${i}`} />)
        }
    }

    return (
    <div onMouseMove={(e) => moveFigure(e)} onMouseDown={(e) => grabFigure(e)} id="chessboard">
        {board}
    </div>
    )
}

export default Chessboard;