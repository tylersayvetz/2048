import React from 'react';

interface CellProps {

  contents: number | null;
  
}

export default function Cell(props: CellProps) {
  // const color: string = 'hsl(22,100%,' + (props.contents !== null ? 100 - (100 / (props.contents! * 10)) : 100) + '%';
  const colors: Array<string> = ['#E1B07E', '#E5C19E', 'rgb(245, 197, 109)', '#A5998C', '#937F6A', 'indigo', 'violet', 'turquiose', 'lightyellow', 'brown', 'black'];
  const index = Math.log2(props.contents || -1);
  const style: React.CSSProperties = {
    backgroundColor: colors[index - 1],
    color: index < 4 ? 'rgb(83, 80, 58)' : 'ivory',
  }

  return (
    <div className='cell' style={style}>{props.contents}</div>
  )
}