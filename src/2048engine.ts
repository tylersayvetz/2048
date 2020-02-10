import { randomInt } from "./util";

type Board = Array<number | null>;
type CellContent = number | null;
type TwoDBoard = Array<Board>;

export default class Engine {
  width: number;
  height: number;
  board: Array<number | null>;
  score: number;
  gameStatus: string | null;

  constructor(width: number, height: number) {
    this.height = height;
    this.width = width;
    this.board = (new Array(16)).fill(null);
    this.score = 0;
    this.gameStatus = null;

    // here is a seed, if needed.
    // this.board = [2, 2, 2048, 2, null, 2, 256, 8, 1024, 8, 512, 64, 16, 32, 64, 128]
    // this.board = [2, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null]

  }

  getBoard(): Board {
    return this.board;
  }

  clearBoard(): Array<null> {
    return (new Array(16)).fill(null);
  }

  getScore(): number {
    return this.score;
  }

  getStatus(): string | null {
    return this.gameStatus;
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

  playerMove(key: number) {
    //so long as the game is still active.. 
    if (this.gameStatus !== 'lost') {

      //update the score
      this.score = this.board.reduce((acc: number, cell: CellContent) => {
        return acc += cell || 0;
      }, 0)

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

      //make the new board.
      let returnBoard: Board =  this.nextBoard(key, horizontalBoard, verticalBoard);

      // set up comparisson between old and new boards
      const prevBoard = new Array(...this.board);
      const availableSpaces: number = returnBoard.filter(cell => cell === null).length;
      this.board = returnBoard;

      //compare the two boards.
      const same = this.compareBoards(returnBoard, prevBoard);

      //if the board hasnt changed AND there are no abvailable spaces, game over condition might exist.
      if (same && availableSpaces === 0) {
        this.gameStatus = this.checkGameOver(verticalBoard, horizontalBoard) ? 'lost' : null;

        //else, if the board changed, seed the board.
      } else if (!same) {
        this.seedBoard(1);
      }
      // else do nothing.
    }
  }

  private handleCollapse(board: TwoDBoard, direction: string, returnBoard: Board): any {
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

      //if all the checkcollapsed elements are true (meaning each row has no gaps), stop looping by setting collapsed to true..
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

  private vertical2Dto1D(vert: TwoDBoard): Board {
    let oneD: Board = [];
    for (let i = 0; i < 4; i++) {
      vert.forEach(column => {
        oneD.push(column[i]);
      })
    }
    return oneD;
  }

  private horizontal2Dto1D(horiz: TwoDBoard): Board {
    let oneD: Board = [];
    horiz.forEach(sub => {
      oneD = oneD.concat(sub)
    })
    return oneD
  }

  //return true if the boards are the same
  private compareBoards(a: Board, b: Board): boolean {
    return a.reduce((acc: boolean, cell: CellContent, idx: number) => {
      if (!acc) { return false }
      return cell === b[idx] ? true : false
    }, true);
  }

  //try every direction for possibilities of movement.
  // If all results match this.board, youre locked. Cant move. (game over: return true)
  private checkGameOver(vertical: TwoDBoard, horizontal: TwoDBoard): boolean {

    //TODO: figure out why 'right' and 'down' dont allow you to lose, even when you've lost. check cantMove Array and work back from there. 
    let cantMove = (new Array(4)).fill(false);
    for (let i = 0; i < 4; i++) {
      const check = this.compareBoards(this.nextBoard(37 + i, horizontal, vertical), this.board);
      cantMove[i] = check;
    }

    return cantMove.filter(same => same === true).length === 4 ? true : false;
  }

  private nextBoard(key: number, horizontal: TwoDBoard, vertical: TwoDBoard): Board {
    let returnBoard: Board = [];

    //functions based on the user action. (key codes: 37, 38, 39, 40)
    switch (key) {
      case 37:
        returnBoard = this.handleCollapse(horizontal, 'left', returnBoard);
        break;
      case 38:
        returnBoard = this.handleCollapse(vertical, 'up', returnBoard);
        break;
      case 39:
        returnBoard = this.handleCollapse(horizontal.map(row => row.reverse()), 'right', returnBoard);
        break;
      case 40:
        returnBoard = this.handleCollapse(vertical.map(column => column.reverse()), 'down', returnBoard);
        break;
    }

    return returnBoard;

  }

}
