import "./App.css";
import Chessboard from "./components/Chessboard";
import React from "react";

function App(props) {
  console.log(props);
  return (
    <div className="app">
      <Chessboard player_number={props.player_number} />
    </div>
  );
}

export default App;
