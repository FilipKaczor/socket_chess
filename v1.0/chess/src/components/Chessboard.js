import React from 'react';
import "../components/Chessboard.css"

const verticalAxis = [1,2,3,4,5,6,7,8];
const horizontalAxis = ["a","b","c","d","e","f","g","h"]

function Chessboard() 
{
    let board = [];

    for(let i=0; i<horizontalAxis.length; i++)
        {
            for(let j=0; j<verticalAxis; j++)
                {
                    board.push(<span>{verticalAxis[j]}{horizontalAxis[i]}</span>)
                }
        }

    return <div id="chessboard">{board[0]}</div>
}

export default Chessboard;