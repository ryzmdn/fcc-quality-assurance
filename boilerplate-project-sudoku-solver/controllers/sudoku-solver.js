class SudokuSolver {
  validate(puzzleString) {
    return null;
  }

  letterToNumber(row) {
    return "ABCDEFGHI".indexOf(row.toUpperCase()) + 1;
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[row - 1][i] == value) {
        return false;
      }
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][column - 1] !== 0) {
      return false;
    }
    for (let i = 0; i < 9; i++) {
      if (grid[i][column - 1] == value) {
        return false;
      }
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, col, value) {
    let grid = this.transform(puzzleString);
    row = this.letterToNumber(row);
    if (grid[row - 1][col - 1] !== 0) {
      return false;
    }
    let rowStart = row - (row % 3),
       colStart = col - (col % 3);
    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (grid[i + rowStart][j + colStart] == value) return false;
    return true;
  }

  solveSuduko(grid, row, col) {
    const size = 9;

    if (row == size - 1 && col == size) return grid;

    if (col == size) {
      row++;
      col = 0;
    }

    if (grid[row][col] != 0) return this.solveSuduko(grid, row, col + 1);

    for (let num = 1; num < 10; num++) {
      if (this.isSafe(grid, row, col, num)) {
        grid[row][col] = num;

        if (this.solveSuduko(grid, row, col + 1)) return grid;
      }

      grid[row][col] = 0;
    }
    return false;
  }

  isSafe(grid, row, col, num) {
    if (grid[row].includes(num)) return false;
    if (grid.some(r => r[col] === num)) return false;

    const rowStart = row - (row % 3);
    const colStart = col - (col % 3);

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (grid[rowStart + i][colStart + j] === num) return false;
      }
    }
    return true;
  }

  transform(puzzleString) {
    return Array.from({ length: 9 }, (_, i) =>
      puzzleString.slice(i * 9, i * 9 + 9).split("").map(num => (num === "." ? 0 : +num))
    );
  }

  solve(puzzleString) {
    if (puzzleString.length != 81) {
      return false;
    }
    if (/[^0-9.]/g.test(puzzleString)) {
      return false;
    }
    let grid = this.transform(puzzleString);
    let solved = this.solveSuduko(grid, 0, 0);
    if (!solved) {
      return false;
    }
    return solved.flat().join("");
  }
}

module.exports = SudokuSolver;
