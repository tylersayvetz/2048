import { randomInt } from "./util";

type Board = Array<number | null>;
type CellContent = number | null;
type TwoDBoard = Array<Board>;

export default class Engine {
  width: number;
  height: number;
  board: Array<number | null>;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.board = (new Array(16)).fill(null);

    // here is a seed, if needed.
    // this.board = [2, 2, 2, 2, null, 2, null, 8, null, 8, null, 64, 16, 32, 64, 128]
    //locked seed...
    // this.board = [2, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]

  }

  getBoard(): Board {
    return this.board;
  }

  clearBoard(): Array<null> {
    return (new Array(16)).fill(null);
  }


  //seed board with 
  seedBoard(numberSeeds: number) {
    let i = 0;
    while (i < numberSeeds) {
      const seed = randomInt(0, 16);
      if (this.board[seed] === null) {
        this.board[seed] = 2;
        i++;
      }
    }
  }

  // copy2Darray(inputArr: TwoDBoard): TwoDBoard {

  // }

  handleCollapse(board: TwoDBoard, direction: string, returnBoard: Board): any {
    //create board to hold current condition. Create collapsed and combined bools.
    let collapsed: boolean = false;
    let combined: boolean = false;
    

    while (collapsed === false) {


      //sort the sub arrays to have numbers on the left.
      // eslint-disable-next-line no-loop-func
      board = board.map(row => {
        row = row.filter(cell => cell !== null);
        row.push(...(new Array(4 - row.length).fill(null)));

        //collapse (add like numbers)
        if (combined === false) {
          row = row.map((cell: CellContent, i: number) => {
            if ((cell !== null && row[i + 1] !== null) && cell === row[i + 1]) {
              cell = cell + row[i + 1]!;
              row[i + 1] = null;
            }
            return cell
          })
        }
        return row
      })


      //prevent recurring collapses on an individual row
      combined = true;

      //check if there are any 'null gaps' in the sub array
      // eslint-disable-next-line no-loop-func
      const checkCollapsed = (new Array(4)).fill(false).map((_, idx) => {
        for (let i = 0; i < board[idx].length - 1; i++) {
          if (board[idx][i] === null && board[idx][i + 1] !== null) {
            return false;
          }
        }
        return true;
      })

      //if all the checkcollapsed elements are true, stop looping by setting collapsed to true..
      collapsed = (checkCollapsed.filter(check => check === true).length === 4) ? true : false
    }

    //build the 1D return board.
    if (direction === 'left') {
      return this.horizontal2Dto1D(board);
    } else if (direction === 'up') {
      return this.vertical2Dto1D(board);
    } else if (direction === 'right') {
      board = board.map(row => row.reverse())
      return this.horizontal2Dto1D(board);
    } else if (direction === 'down') {
      board = board.map(column => column.reverse())
      return this.vertical2Dto1D(board);
    } else {
      console.error('Cannot determine which direction you want.')


      return this.board;
    }
  }


  vertical2Dto1D(vert: TwoDBoard): Board {
    let oneD: Board = [];
    for (let i = 0; i < 4; i++) {
      vert.forEach(column => {
        oneD.push(column[i]);
      })
    }
    return oneD;
  }

  horizontal2Dto1D(horiz: TwoDBoard): Board {
    let oneD: Board = [];
    horiz.forEach(sub => {
      console.log(sub);
      oneD = oneD.concat(sub)
    })
    return oneD
  }


  /* 
  key codes: 
  37: left
  38: up
  39: right
  40: down
*/
  playerMove(key: number) {

    //make a 2D board, horizontally oriented.
    let horizontalBoard: TwoDBoard = [];
    for (let i = 0; i < 4; i++) {
      horizontalBoard.push(this.board.slice(i * 4, (i + 1) * 4));
    }

    //and another one, vertically oriented.
    let verticalBoard: TwoDBoard = [];
    for (let i = 0; i < 4; i++) {
      let sub: Board = [];
      for (let j = 0; j < 4; j++) {
        sub.push(this.board[j * 4 + i]);
      }
      verticalBoard.push(sub);
    }

    //this will be our new board.
    let returnBoard: Board = [];

    //do actions based on the key pressed.
    switch (key) {
      case 37:
        returnBoard = this.handleCollapse(horizontalBoard, 'left', returnBoard);
        break;
      case 38:
        returnBoard = this.handleCollapse(verticalBoard, 'up', returnBoard);
        break;
      case 39:
        returnBoard = this.handleCollapse(horizontalBoard.map(row => row.reverse()), 'right', returnBoard);
        break;
      case 40:
        returnBoard = this.handleCollapse(verticalBoard.map(column => column.reverse()), 'down', returnBoard);
        break;
    }

    //Set the new this.board
    //if the board was able to change, seed the board with another number. If not, prevent seed. 
    const prevBoard = new Array(...this.board);
    this.board = returnBoard; 
    
    const same = returnBoard.reduce((acc: boolean, cell: CellContent, idx: number) => {
      if (!acc) {return false}
      return cell === prevBoard[idx] ? true : false
    }, true);

    if (!same) {
      this.seedBoard(1);
    } 
  }


}
