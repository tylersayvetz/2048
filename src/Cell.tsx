import React from 'react';

interface CellProps {

  contents: number | null;
  
}

export default function Cell(props: CellProps) {
  const colors: Array<string> = [
    '#E1B07E',   
    '#E5C19E', 
    'rgb(245, 197, 109)', 
    '#A5998C', 
    '#A1867F', 
    '#9B829A', 
    '#C49BBB', 
    '#D1BCE3', 
    '#AF5048', 
    '#f2a916', 
    '#ffee30'
  ];
  const index = Math.log2(props.contents || -1);
  const style: React.CSSProperties = {
    backgroundColor: colors[index - 1],
    color: (index < 4 || index === 9) ? 'rgb(83, 80, 58)' : 'ivory',
    fontSize: index >= 10 ? '40px' : '50px'
  }

  return (
    <div className='cell' style={style}>{props.contents}</div>
  )
}