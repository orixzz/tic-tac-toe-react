import { useState } from 'react';

/*
 TODO
  3) Add a toggle button that lets you sort the moves in either ascending or descending order.
  4) When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
  5) Display the location for each move in the format (row, col) in the move history list.
*/


function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }


  const winner = calculateWinner(squares);
        let status;
        if (winner) {
          status = "Winner: " + winner;
        } else {
          status = "Next player: " + (xIsNext ? "X" : "O");
        }


    //RENDER GRID
    const grid = [];
    let k = 0; //key to avoid errors

    for (let i = 0; i < 3; i++) {
        const col = [];
        for (let j = 0; j < 3; j++) {//push argument without {}, <>
            col.push(<Square key={k++} value={squares[3*i+j]} onSquareClick={() => handleClick(3*i+j)} />);
        }
        grid.push(<div key={k} className="board-row">{col}</div>);
    }

    return (
      <>
        <div className="status">{status}</div>
        <div>
            {grid}
        </div>
      </>
    );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const currentSquares = history[currentMove];
  const xIsNext = currentMove % 2 === 0;

  function handlePlay(nextSquares) {
      const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
      setHistory(nextHistory);
      setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
      setCurrentMove(nextMove)
  }

  const moves = history.map((squares, move) => {
  let description;
  let max = history.length - 1;
  let atMax = move == max;

  if (move == 0) {
       description = 'Go to game start';
  } else if (move < max) {
       description = 'Go to move #' + move;
  } else if (atMax) {
       description = 'You are at move ' + move;
  }

  if (atMax) {
      return (
         <li key={move}>
           <span onClick={() => jumpTo(move)}>{description}</span>
         </li>
        );
  } else {
      return (
         <li key={move}>
           <button onClick={() => jumpTo(move)}>{description}</button>
         </li>
        );
  }


  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

