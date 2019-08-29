import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  const winningBackground = {
    background: 'blue'
  }

      return (
        <button style={props.index ? winningBackground : null} className="square" onClick={props.onClick}>
            {props.value}
        </button>
      );
}
  
  class Board extends React.Component {
    
    renderSquare(i) {
      return (
        <Square
        key={i}
        index={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}/>
      );
    }
    
    render() {
    const row = 3, col = 3;
      return ( 
        <div>
            {[...new Array(row)].map((x, rowIndex) => {
                return (
                    <div className="board-row" key={rowIndex}>
                        {[...new Array(col)].map((y, colIndex) => this.renderSquare(rowIndex*col + colIndex))}
                    </div>
                )
            })}
          
        </div>
      );
    }
  }
  
  class Game extends React.Component {
      constructor(props) {
          super(props);
          this.state = {
              history: [{
                  squares: Array(9).fill(null),
              }],
              stepNumber: 0,
              xIsNext: true,
              lastSelected: -1,
              isButtonPressed: true,
          };
      }

      handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1]
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
          });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            lastSelected: step
        });
    }

    switchMoves() {
      this.setState({
        isButtonPressed: !this.state.isButtonPressed
      })
    }
  
    render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const lastNumber = this.state.lastSelected;

    const moves = history.map((step, move) => {
        const desc = move ?
        `Go to move # ${move}` :
        `Go to game start`

        return (
            <li key={move}>
                <button className={lastNumber === move ? "bold" : "normal"} onClick={() => this.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    
    

    let status;
    if(winner) {
        status = `Winner: ${winner.player}`;
    } else if (!current.squares.includes(null)) {
      status = `IT'S A DRAW!!`
    }
    else {
        status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
    }
      return (  
        <div className="game">
          <div className="game-board">
            <Board 
            winningSquares= {winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{this.state.isButtonPressed ? moves : moves.reverse()}</ol>
          </div>
            <div className="game-info">
                <button onClick={() => this.switchMoves()}>Switch</button>
            </div>
        </div>
      );

    }
  }


  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

  function calculateWinner(squares) {
    const lines = [ 
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          player: squares[a],
          line: [a, b, c]
        }
      }
    }
    return null;
  }
  