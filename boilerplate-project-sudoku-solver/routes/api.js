"use strict";

let SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let { puzzle, coordinate, value } = req.body;

    if (!puzzle || !coordinate || !value) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (!/^[1-9]$/.test(value)) {
      return res.json({ error: "Invalid value" });
    }

    if (coordinate.length !== 2 || !/^[A-Ia-i]$/.test(coordinate[0]) || !/^[1-9]$/.test(coordinate[1])) {
      return res.json({ error: "Invalid coordinate" });
    }

    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    if (/[^0-9.]/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    let row = coordinate[0].toUpperCase().charCodeAt(0) - "A".charCodeAt(0);
    let col = parseInt(coordinate[1]) - 1;
    let index = row * 9 + col;

    if (puzzle[index] === value) {
      return res.json({ valid: true });
    }

    let validRow = solver.checkRowPlacement(puzzle, coordinate[0], coordinate[1], value);
    let validCol = solver.checkColPlacement(puzzle, coordinate[0], coordinate[1], value);
    let validReg = solver.checkRegionPlacement(puzzle, coordinate[0], coordinate[1], value);

    if (validRow && validCol && validReg) {
      return res.json({ valid: true });
    }

    let conflicts = [];
    if (!validRow) conflicts.push("row");
    if (!validCol) conflicts.push("column");
    if (!validReg) conflicts.push("region");

    return res.json({ valid: false, conflict: conflicts });
  });

  app.route("/api/solve").post((req, res) => {
    let { puzzle } = req.body;

    if (!puzzle) {
      return res.json({ error: "Required field missing" });
    }
    if (puzzle.length !== 81) {
      return res.json({ error: "Expected puzzle to be 81 characters long" });
    }
    if (/[^0-9.]/.test(puzzle)) {
      return res.json({ error: "Invalid characters in puzzle" });
    }

    let solvedString = solver.solve(puzzle);
    if (!solvedString) {
      return res.json({ error: "Puzzle cannot be solved" });
    }

    return res.json({ solution: solvedString });
  });
};
