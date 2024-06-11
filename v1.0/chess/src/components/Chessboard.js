import React, { useEffect, useState, useRef } from "react";
import Figure from "../components/Figure";
import "../components/Chessboard.css";

class Piece {
  constructor(image, x, y) {
    this.image = image;
    this.x = x;
    this.y = y;
  }
}

const pieces = [];

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

function Chessboard(props) {
  //Figure movement
  let firstRenderBoard = [];
  let chessboardRef = useRef(null);
  let activeFigure = null;
  let startX = null;
  let startY = null;

  const [getBoard, setBoard] = useState(initializeBoard());

  function initializeBoard() {
    let firstRenderBoard = [[]];

    for (let i = 0; i < 8; i++) {
      firstRenderBoard[i] = [];
      for (let j = 0; j < 8; j++) {
        firstRenderBoard[i][j] = "";
      }
    }

    //Definiowanie tablicy (inna dla gracza 1 i inna dla gracza 2)
    // if (props.player_number == 1) {
    for (let i = 0; i < 8; i++) {
      pieces.push(new Piece("images/pawn_b.png", i, 6));
      firstRenderBoard[6][i] = "images/pawn_b.png";
      pieces.push(new Piece("images/pawn_w.png", i, 1));
      firstRenderBoard[1][i] = "images/pawn_w.png";
    }
    for (let i = 0; i < 2; i++) {
      const type = i === 0 ? "b" : "w";
      const num = i === 0 ? 7 : 0;

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
    // } else {
    //   for (let i = 0; i < 8; i++) {
    //     pieces.push(new Piece("images/pawn_b.png", i, 1));
    //     firstRenderBoard[1][i] = "images/pawn_b.png";
    //     pieces.push(new Piece("images/pawn_w.png", i, 6));
    //     firstRenderBoard[6][i] = "images/pawn_w.png";
    //   }
    //   for (let i = 0; i < 2; i++) {
    //     const type = i === 0 ? "w" : "b";
    //     const num = i === 0 ? 7 : 0;

    //     pieces.push(new Piece(`images/rook_${type}.png`, 0, num));
    //     firstRenderBoard[num][0] = `images/rook_${type}.png`;

    //     pieces.push(new Piece(`images/rook_${type}.png`, 7, num));
    //     firstRenderBoard[num][7] = `images/rook_${type}.png`;

    //     pieces.push(new Piece(`images/knight_${type}.png`, 1, num));
    //     firstRenderBoard[num][1] = `images/knight_${type}.png`;

    //     pieces.push(new Piece(`images/knight_${type}.png`, 6, num));
    //     firstRenderBoard[num][6] = `images/knight_${type}.png`;

    //     pieces.push(new Piece(`images/bishop_${type}.png`, 2, num));
    //     firstRenderBoard[num][2] = `images/bishop_${type}.png`;

    //     pieces.push(new Piece(`images/bishop_${type}.png`, 5, num));
    //     firstRenderBoard[num][5] = `images/bishop_${type}.png`;

    //     pieces.push(new Piece(`images/queen_${type}.png`, 3, num));
    //     firstRenderBoard[num][3] = `images/queen_${type}.png`;

    //     pieces.push(new Piece(`images/king_${type}.png`, 4, num));
    //     firstRenderBoard[num][4] = `images/king_${type}.png`;
    //   }
    // }

    return firstRenderBoard;
  }

  function grabFigure(e) {
    let element = e.target;

    if (props.player_number === 1) {
      startX =
        7 - Math.floor((e.clientY - chessboardRef.current.offsetTop) / 100);
      startY = Math.floor((e.clientX - chessboardRef.current.offsetLeft) / 100);
    } else {
      startX = Math.floor((e.clientY - chessboardRef.current.offsetTop) / 100);
      startY = Math.floor((e.clientX - chessboardRef.current.offsetLeft) / 100);
    }

    if (element.classList.contains("chesspiece")) {
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;

      activeFigure = element;
    }
  }

  function moveFigure(e) {
    const chessboard = chessboardRef.current;
    if (activeFigure && chessboard) {
      const minX = chessboard.offsetLeft - 25;
      const maxX = chessboard.offsetLeft + 725;
      const minY = chessboard.offsetTop - 25;
      const maxY = chessboard.offsetTop + 725;
      const x = e.clientX - 50;
      const y = e.clientY - 50;
      activeFigure.style.position = "absolute";
      activeFigure.style.left = `${x}px`;
      activeFigure.style.top = `${y}px`;

      if (x < minX) {
        activeFigure.style.left = `${minX}px`;
      } else if (x > maxX) {
        activeFigure.style.left = `${maxX}px`;
      } else activeFigure.style.left = `${x}px`;

      if (y < minY) {
        activeFigure.style.top = `${minY}px`;
      } else if (y > maxY) {
        activeFigure.style.top = `${maxY}px`;
      } else activeFigure.style.top = `${y}px`;
    }
  }

  function dropFigure(e) {
    if (activeFigure) {
      activeFigure.style.pointerEvents = "none";

      const x = e.clientX;
      const y = e.clientY;
      const elementUnderFigure = document.elementFromPoint(x, y);

      const pomX = Math.floor(
        (e.clientY - chessboardRef.current.offsetTop) / 100
      );
      const pomY = Math.floor(
        (e.clientX - chessboardRef.current.offsetLeft) / 100
      );

      console.log(startX, startY);
      console.log(pomX, pomY);
      console.log(getBoard);

      const pomFigure = getBoard[startX][startY];
      const newBoard = [...getBoard]; // Create a copy of the current state
      newBoard[pomX][pomY] = pomFigure; // Update the nested array
      newBoard[startX][startY] = ""; // Clear the previous position
      setBoard(newBoard); // Set the new state

      console.log(getBoard);

      console.log("Element underneath: ", elementUnderFigure);
      console.log(e.target);

      activeFigure.style.pointerEvents = "";

      activeFigure = null;
    }
  }
  // useEffect()

  let board = [];

  for (let j = verticalAxis.length - 1; j >= 0; j--) {
    for (let i = 0; i < horizontalAxis.length; i++) {
      const number = j + i + 2;
      let image =
        props.player_number === 1 ? getBoard[j][i] : getBoard[7 - j][7 - i];

      board.push(<Figure image={image} number={number} key={`${j},${i}`} />);
    }
  }

  return (
    <div
      onMouseMove={(e) => moveFigure(e)}
      onMouseDown={(e) => grabFigure(e)}
      onMouseUp={(e) => dropFigure(e)}
      id="chessboard"
      ref={chessboardRef}
    >
      {board}
    </div>
  );
}

export default Chessboard;
