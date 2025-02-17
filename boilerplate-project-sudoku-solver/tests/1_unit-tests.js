const chai = require("chai");
const assert = chai.assert;
const Solver = require("../controllers/sudoku-solver.js");

let solver = new Solver();
let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let solvedPuzzle = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite("UnitTests", () => {
  suite("Solver Functionality", () => {
    test("Handles a valid puzzle string of 81 characters", (done) => {
      assert.equal(solver.solve(validPuzzle), solvedPuzzle);
      done();
    });

    test("Rejects a puzzle string with invalid characters", (done) => {
      let invalidPuzzle = "1.5..2.84..63.12.7.2..5..g..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.isFalse(solver.solve(invalidPuzzle));
      done();
    });

    test("Rejects a puzzle string that is not 81 characters long", (done) => {
      let shortPuzzle = "1.5..2.84..63.12.7.2..5.......9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.isFalse(solver.solve(shortPuzzle));
      done();
    });
  });

  suite("Placement Validation", () => {
    test("Validates correct row placement", (done) => {
      assert.isTrue(solver.checkRowPlacement(validPuzzle, "A", "2", "9"));
      done();
    });

    test("Detects incorrect row placement", (done) => {
      assert.isFalse(solver.checkRowPlacement(validPuzzle, "A", "2", "1"));
      done();
    });

    test("Validates correct column placement", (done) => {
      assert.isTrue(solver.checkColPlacement(validPuzzle, "A", "2", "8"));
      done();
    });

    test("Detects incorrect column placement", (done) => {
      assert.isFalse(solver.checkColPlacement(validPuzzle, "A", "2", "9"));
      done();
    });

    test("Validates correct region (3x3 grid) placement", (done) => {
      assert.isTrue(solver.checkRegionPlacement(validPuzzle, "A", "2", "3"));
      done();
    });

    test("Detects incorrect region (3x3 grid) placement", (done) => {
      assert.isFalse(solver.checkRegionPlacement(validPuzzle, "A", "2", "1"));
      done();
    });
  });

  suite("Solver Accuracy", () => {
    test("Solves a valid puzzle string", (done) => {
      assert.equal(solver.solve(validPuzzle), solvedPuzzle);
      done();
    });

    test("Fails to solve an invalid puzzle", (done) => {
      let invalidPuzzle = "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
      assert.isFalse(solver.solve(invalidPuzzle));
      done();
    });

    test("Solves an incomplete puzzle correctly", (done) => {
      let incompletePuzzle = "..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1";
      let solution = "218396745753284196496157832531672984649831257827549613962415378185763429374928561";
      assert.equal(solver.solve(incompletePuzzle), solution);
      done();
    });
  });
});