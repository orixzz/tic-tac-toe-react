import { useState } from 'react';

//good article on the extras https://seanaujong.medium.com/implementing-the-react-tic-tac-toe-challenges-ed57d7ae4f67

function Square({ value, onSquareClick, winner }) {
    const className = winner
        ? "square winner"
        : "square"
    return (
        <button className={className} onClick={onSquareClick}>
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {

    function handleClick(i) {
        const [a, b, c, winner] = checkBoardState(squares);
        if (winner || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        if (xIsNext) {
            nextSquares[i] = 'X';
        } else {
            nextSquares[i] = 'O';
        }
        onPlay(nextSquares, i);
    }


    const [coordinateA, coordinateB, coordinateC, winner, draw] = checkBoardState(squares);

    let status;
    if (winner) {
        status = "Winner: " + winner;
    } else if (draw) {
        status = "Draw"
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O");
    }


    //RENDER GRID
    const grid = [];
    let k = 0; //key to avoid errors

    for (let i = 0; i < 3; i++) {
        const col = [];
        for (let j = 0; j < 3; j++) { //push argument without {}, <>

            const gridNumber = 3 * i + j
            let winningCoordinate = false;
            if ([coordinateA, coordinateB, coordinateC].includes(gridNumber)) {
                winningCoordinate = true;
            }
            col.push(<Square key={k++} value={squares[gridNumber]} onSquareClick={() => handleClick(gridNumber)} winner={winningCoordinate} />);
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
    const [history, setHistory] = useState([{ squares: Array(9).fill(null), index: -1 }]);
    const [currentMove, setCurrentMove] = useState(0);
    const currentSquares = history[currentMove].squares;
    const xIsNext = currentMove % 2 === 0;
    const [xHistoryFlipped, setHistoryFlipped] = useState(false);

    function handlePlay(nextSquares, i) {
        const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, index: i }];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove)
    }

    function flipHistory() {
        setHistoryFlipped(!xHistoryFlipped);
    }

    const moves = history.map((turnInfo, move) => {
        let description;
        let max = history.length - 1;
        let atMax = move == max;

        if (max === 0) {
            description = 'No moves yet';
        } else if (move == 0) {
            description = 'Go to game start';
        } else {
            const row = Math.floor(turnInfo.index / 3) + 1;
            const col = turnInfo.index % 3 + 1;
            const symbol = turnInfo.index % 2 === 0 ? 'X' : 'O';

            if (move < max) {
                description = 'Go to move #' + move + ' - ' + symbol + '(' + row + ', ' + col + ')';
            } else {
                description = 'You are at move #' + move + ' - ' + symbol + '(' + row + ', ' + col + ')';
            }
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
                <ol>{xHistoryFlipped ? moves : moves.slice().reverse()}</ol>
            </div>
            <div className="history-toggle">
                <ToggleButton flipHistory={flipHistory} />
            </div>
        </div>
    );
}

function ToggleButton({ flipHistory }) {
    const [isToggled, setIsToggled] = useState(false);

    const handleChange = () => {
        setIsToggled(!isToggled);
        flipHistory();
    };

    return (
        <button onClick={handleChange} className={`toggle-button ${isToggled ? 'FIRST' : 'LAST'}`}>
            {isToggled ? 'CURRENT FIRST' : 'CURRENT LAST'}
        </button>
    );
}

function checkBoardState(squares) {
    //Check for a winner
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
            return [a, b, c, squares[a], null];
        }
    }

    //it's a draw
    if (!squares.some(el => el === null)) {
        return [null, null, null, null, true];
    }

    //nothing going on
    return [null, null, null, null, null];
}
