import React, { useEffect, useState, useRef } from "react";
import Figure from "../components/Figure";
import "../components/Chessboard.css";
import socket from "../index.js";

// class Piece {
//   constructor(image, x, y) {
//     this.image = image;
//     this.x = x;
//     this.y = y;
//   }
// }

// const pieces = [];

const verticalAxis = ["1", "2", "3", "4", "5", "6", "7", "8"];
const horizontalAxis = ["a", "b", "c", "d", "e", "f", "g", "h"];

function Chessboard(props) {
  //Figure movement
  let firstRenderBoard = [];
  let chessboardRef = useRef(null);
  let activeFigure = null;
  let startX = null;
  let startY = null;
  let startingX = null;
  let startingY = null;

  const [getBoard, setBoard] = useState(initializeBoard());
  const [getTurn, setTurn] = useState(0); // okreslenie kto ma teraz ture

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
      // pieces.push(new Piece("images/pawn_b.png", i, 6));
      firstRenderBoard[6][i] = "images/pawn_b.png";
      // pieces.push(new Piece("images/pawn_w.png", i, 1));
      firstRenderBoard[1][i] = "images/pawn_w.png";
    }
    for (let i = 0; i < 2; i++) {
      const type = i === 0 ? "b" : "w";
      const num = i === 0 ? 7 : 0;

      // pieces.push(new Piece(`images/rook_${type}.png`, 0, num));
      firstRenderBoard[num][0] = `images/rook_${type}.png`;

      // pieces.push(new Piece(`images/rook_${type}.png`, 7, num));
      firstRenderBoard[num][7] = `images/rook_${type}.png`;

      // pieces.push(new Piece(`images/knight_${type}.png`, 1, num));
      firstRenderBoard[num][1] = `images/knight_${type}.png`;

      // pieces.push(new Piece(`images/knight_${type}.png`, 6, num));
      firstRenderBoard[num][6] = `images/knight_${type}.png`;

      // pieces.push(new Piece(`images/bishop_${type}.png`, 2, num));
      firstRenderBoard[num][2] = `images/bishop_${type}.png`;

      // pieces.push(new Piece(`images/bishop_${type}.png`, 5, num));
      firstRenderBoard[num][5] = `images/bishop_${type}.png`;

      // pieces.push(new Piece(`images/queen_${type}.png`, 3, num));
      firstRenderBoard[num][3] = `images/queen_${type}.png`;

      // pieces.push(new Piece(`images/king_${type}.png`, 4, num));
      firstRenderBoard[num][4] = `images/king_${type}.png`;
    }

    return firstRenderBoard;
  }

  function grabFigure(e) {
    let element = e.target;
    let figureColor = null;

    if (element.classList.contains("chesspiece")) {
      figureColor = element.style.backgroundImage.split("/")[1];
      figureColor = figureColor.split(".")[0];
      figureColor = figureColor.split("_");
    }

    if (figureColor != undefined) {
      if (
        props.player_number === 1 &&
        figureColor[1] === "w" &&
        getTurn % 2 === 0
      ) {
        startY = Math.floor(
          (e.clientX - chessboardRef.current.offsetLeft) / 100
        );
        startX =
          7 - Math.floor((e.clientY - chessboardRef.current.offsetTop) / 100);
        if (element.classList.contains("chesspiece")) {
          const rect = element.getBoundingClientRect();
          startingX = rect.left;
          startingY = rect.top;
          console.log("StartingX: ", startingX, " StartingY: ", startingY);

          const x = e.clientX - 50;
          const y = e.clientY - 50;
          element.style.position = "absolute";
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          activeFigure = element;
        }
      } else if (
        props.player_number === 2 &&
        figureColor[1] === "b" &&
        getTurn % 2 === 1
      ) {
        startX = Math.floor(
          (e.clientY - chessboardRef.current.offsetTop) / 100
        );
        startY =
          7 - Math.floor((e.clientX - chessboardRef.current.offsetLeft) / 100);

        if (element.classList.contains("chesspiece")) {
          const rect = element.getBoundingClientRect();
          startingX = rect.left;
          startingY = rect.top;
          console.log("StartingX: ", startingX, " StartingY: ", startingY);

          const x = e.clientX - 50;
          const y = e.clientY - 50;
          element.style.position = "absolute";
          element.style.left = `${x}px`;
          element.style.top = `${y}px`;

          activeFigure = element;
        }
      }
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

      let cond = false;
      let pomX = null;
      let pomY = null;
      const x = e.clientX;
      const y = e.clientY;
      const elementUnderFigure = document.elementFromPoint(x, y);
      let elementUnderFigureColor = null;

      if (props.player_number === 2) {
        pomX = Math.floor((e.clientY - chessboardRef.current.offsetTop) / 100);
        pomY =
          7 - Math.floor((e.clientX - chessboardRef.current.offsetLeft) / 100);
      } else {
        pomX =
          7 - Math.floor((e.clientY - chessboardRef.current.offsetTop) / 100);
        pomY = Math.floor((e.clientX - chessboardRef.current.offsetLeft) / 100);
      }

      // console.log(startX, startY);
      // console.log(elementUnderFigure);
      // console.log(pomX, pomY);
      let figureColor = activeFigure.style.backgroundImage.split("/")[1];
      figureColor = figureColor.split(".")[0];
      figureColor = figureColor.split("_");

      if (elementUnderFigure.classList.contains("chesspiece")) {
        elementUnderFigureColor =
          elementUnderFigure.style.backgroundImage.split("/")[1];
        elementUnderFigureColor = elementUnderFigureColor.split(".")[0];
        elementUnderFigureColor = elementUnderFigureColor.split("_")[1];
      }
      // console.log(Math.abs(pomX - startX));

      if (props.player_number === 1) {
        pomX = 7 - pomX;
        startX = 7 - startX;
        pomY = 7 - pomY;
        startY = 7 - startY;
      }

      // console.log(startX, startY, pomX, pomY);

      if (figureColor[0] === "pawn") {
        if (startX - pomX === 2 && startX === 6 && startY - pomY === 0) {
          cond = true;
        } else if (
          startX - pomX === 1 &&
          startY - pomY === 0 &&
          !elementUnderFigure.classList.contains("chesspiece")
        ) {
          cond = true;
        } else if (
          startX - pomX === 1 &&
          Math.abs(startY - pomY) === 1 &&
          elementUnderFigure.classList.contains("chesspiece")
        ) {
          cond = true;
        } else cond = false;
      } else if (figureColor[0] === "rook") {
        if (startX === pomX) {
          cond = true;
          if (pomY > startY) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x + i * 100,
                y
              );
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY < startY) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x - i * 100,
                y
              );
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          }
        } else if (startY === pomY) {
          cond = true;
          if (pomX > startX) {
            for (let i = 1; i < Math.abs(pomX - startX); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x,
                y - i * 100
              );
              // console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomX < startX) {
            for (let i = 1; i < Math.abs(pomX - startX); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x,
                y + i * 100
              );
              // console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          }
        } else {
          cond = false;
        }
      } else if (figureColor[0] === "knight") {
        if (
          (Math.abs(pomX - startX) === 2 && Math.abs(pomY - startY) === 1) ||
          (Math.abs(pomX - startX) === 1 && Math.abs(pomY - startY) === 2)
        ) {
          cond = true;
        } else cond = false;
      } else if (figureColor[0] === "bishop") {
        if (Math.abs(pomY - startY) === Math.abs(pomX - startX)) {
          cond = true;
          if (pomY > startY && pomX > startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x + i * 100,
                y - i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY < startY && pomX < startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x - i * 100,
                y + i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY < startY && pomX > startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x - i * 100,
                y - i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY > startY && pomX < startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x + i * 100,
                y + i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          }
        } else {
          cond = false;
        }
      } else if (figureColor[0] === "queen") {
        if (Math.abs(pomY - startY) === Math.abs(pomX - startX)) {
          cond = true;
          if (pomY > startY && pomX > startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x + i * 100,
                y - i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY < startY && pomX < startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x - i * 100,
                y + i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY < startY && pomX > startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x - i * 100,
                y - i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY > startY && pomX < startX) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x + i * 100,
                y + i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          }
        } else if (startX === pomX) {
          cond = true;
          if (pomY > startY) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x + i * 100,
                y
              );
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomY < startY) {
            for (let i = 1; i < Math.abs(pomY - startY); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x - i * 100,
                y
              );
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          }
        } else if (startY === pomY) {
          cond = true;
          if (pomX > startX) {
            for (let i = 1; i < Math.abs(pomX - startX); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x,
                y - i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          } else if (pomX < startX) {
            for (let i = 1; i < Math.abs(pomX - startX); i += 1) {
              let elementUnderFigureRook = document.elementFromPoint(
                x,
                y + i * 100
              );
              console.log(elementUnderFigureRook);
              if (
                elementUnderFigureRook.childNodes.length > 0 ||
                elementUnderFigureRook.classList.contains("chesspiece")
              ) {
                cond = false;
              }
            }
          }
        } else {
          cond = false;
        }
      } else if (figureColor[0] === "king") {
        if (
          (Math.abs(pomX - startX) === 1 && Math.abs(pomY - startY) === 1) ||
          (Math.abs(pomX - startX) === 0 && Math.abs(pomY - startY) === 1) ||
          (Math.abs(pomX - startX) === 1 && Math.abs(pomY - startY) === 0)
        ) {
          cond = true;
        } else cond = false;
      }

      // console.log(elementUnderFigure, cond);

      if (props.player_number === 1) {
        pomX = Math.abs(7 - pomX);
        startX = Math.abs(7 - startX);
        pomY = Math.abs(7 - pomY);
        startY = Math.abs(7 - startY);
      }
      // console.log(startX, startY, pomX, pomY);

      if (
        (props.player_number === 1 &&
          elementUnderFigureColor === "b" &&
          cond) ||
        (props.player_number === 2 &&
          elementUnderFigureColor === "w" &&
          cond) ||
        (elementUnderFigure.classList.contains("figure") && cond)
      ) {
        // console.log("udane");
        const pomFigure = getBoard[startX][startY];
        const newBoard = [...getBoard];
        newBoard[pomX][pomY] = pomFigure;
        newBoard[startX][startY] = "";
        setBoard(newBoard);

        //Zamiana tury pomiedzy graczami
        socket.emit("turn-change", getTurn);
      } else {
        activeFigure.style.left = `${startingX}px`;
        activeFigure.style.top = `${startingY}px`;
      }

      socket.emit("chessboard", getBoard);

      activeFigure.style.pointerEvents = "";
      activeFigure = null;
    }
  }
  // useEffect()

  socket.on("chessboard-refresh", (board) => {
    setBoard(board);
  });

  socket.on("turn-refresh", (turn) => {
    setTurn(turn);
  });

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
    <div>
      <div className="alert alert-primary turn-div" role="alert">
        {getTurn % 2 === 0 ? "White turn" : "Black turn"}
      </div>
      <div
        onMouseMove={(e) => moveFigure(e)}
        onMouseDown={(e) => grabFigure(e)}
        onMouseUp={(e) => dropFigure(e)}
        id="chessboard"
        ref={chessboardRef}
      >
        {board}
      </div>
    </div>
  );
}

export default Chessboard;
