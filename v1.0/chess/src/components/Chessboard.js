import React from 'react';
import "../components/Chessboard.css"

const verticalAxis = ["1","2","3","4","5","6","7","8"];
const horizontalAxis = ["a","b","c","d","e","f","g","h"]

function Chessboard() 
{
    let board = [];

    for(let j=verticalAxis.length-1; j>=0; j--)
    {
        for(let i=0; i<horizontalAxis.length; i++)
        {
            const number = j + i + 2;

            if( number % 2 == 0 ) {
                board.push(
                    <div className='color-box'></div>
                )
            } else {
                board.push(
                    <div className='white-box'></div>
                )
            }

        }
    }

    return (
    <div id="chessboard">
        {board}
    </div>
    )
}

export default Chessboard;