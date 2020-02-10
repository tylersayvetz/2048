import React, { useState, useEffect, ReactHTML } from 'react';
import Cell from './Cell';
import './2048.css';
import Engine from './2048engine';
import classNames from 'classnames';

const engine = new Engine(4, 4);
// engine.seedBoard(2);

interface GameProps {
}

export default function Twenty48(props: GameProps) {

  //state setters
  const [board, setBoard] = useState(engine.getBoard());
  const [score, setScore] = useState(engine.getScore());
  const [gameOver, setGameOver] = useState(engine.getStatus());

  let gameOverDisplay: React.CSSProperties = {
    display: gameOver === 'lost' ? '' : 'none'
  }
 

  function handleKeyDown(ev: KeyboardEvent) {
    //Main Game Action Loop
    //move the pieces and then set the board state.
    const code = ev.keyCode;
    if (code >= 37 && code <= 40) {
      engine.playerMove(code);

      setBoard(engine.getBoard());
      setScore(engine.getScore());
      setGameOver(engine.getStatus());
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    }
  })

  const rows = []
  for (let i = 0; i < 4; i++) {
    const row = [];
    for (let j = 0; j < 4; j++) {
      const idx = 4 * i + j;
      row.push(<Cell
        contents={board[idx]}
      />)
    }
    rows.push(row);
  }
  return (
    <div
      className='board'
    >
      <div className='header'>Score: {score}</div>
      <div className='game-over-message' style={gameOverDisplay}>Game Over</div>
      <div className={classNames({ gameover: gameOver })}>
        {() => {
          if (gameOver) { return <div className='game-over-message'>'Game Over'</div> }
          return;
        }}
        {
          rows.map((row, i) => {
            return <div key={i} className='row'>{row}</div>
          })
        }
      </div>
    </div>
  )
}
