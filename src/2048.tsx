import React, { useState, useEffect } from 'react';
import Cell from './Cell';
import './2048.css';
import Engine from './2048engine';

const engine = new Engine(4, 4);
engine.seedBoard(2);

interface GameProps {
}

export default function Twenty48(props: GameProps) {
  
  const [board, setBoard] = useState(engine.getBoard());

  function handleKeyDown(ev: KeyboardEvent) {
    const code = ev.keyCode;
    if (code >= 37 && code <= 40) {
      console.log(code);
      //do some shit!
      //move the pieces and then set the board state.
      engine.playerMove(code);
      setBoard(engine.getBoard());
      console.log('Board to Front End', engine.getBoard());
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
      { rows.map((row, i) => {
        return <div key={i} className='row'>{row}</div>
      }) }
    </div>
  )
}
