const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let validPuzzle = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";

suite("Functional Tests", () => {
  test("Solve a puzzle with valid puzzle string", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: validPuzzle })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.solution, "135762984946381257728459613694517832812936745357824196473298561581673429269145378");
        done();
      });
  });

  test("Solve a puzzle with missing puzzle string", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({})
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field missing");
        done();
      });
  });

  test("Solve a puzzle with invalid characters", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "1.5..2.84..63.12.7.2..5..h..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Solve a puzzle with incorrect length", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "1.5..2.84..63.12.7.2..5...9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Expected puzzle to be 81 characters long");
        done();
      });
  });

  test("Solve a puzzle that cannot be solved", (done) => {
    chai.request(server)
      .post("/api/solve")
      .send({ puzzle: "115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37." })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Puzzle cannot be solved");
        done();
      });
  });

  test("Check a puzzle placement with all fields", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "3" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.valid, true);
        done();
      });
  });

  test("Check a puzzle placement with single placement conflict", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "8" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 1);
        done();
      });
  });

  test("Check a puzzle placement with multiple placement conflicts", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "6" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 2);
        done();
      });
  });

  test("Check a puzzle placement with all placement conflicts", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "2" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isFalse(res.body.valid);
        assert.equal(res.body.conflict.length, 3);
        done();
      });
  });

  test("Check a puzzle placement with missing required fields", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, value: "3" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });
  
  test("Check a puzzle placement with invalid characters: POST request to /api/check", function (done) {
    chai
      .request(server)
      .post("/api/check")
      .send({
        puzzle:
          "1.5..2.84..63.12.7.2..5..h..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.",
        coordinate: "A2",
        value: "3",
      })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Check a puzzle placement with invalid characters", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: "1.5..2.84..63.12.7.2..5..h..9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.", coordinate: "A2", value: "3" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid characters in puzzle");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement coordinate", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "L2", value: "3" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid coordinate");
        done();
      });
  });

  test("Check a puzzle placement with invalid placement value", (done) => {
    chai.request(server)
      .post("/api/check")
      .send({ puzzle: validPuzzle, coordinate: "A2", value: "g" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value");
        done();
      });
  });
});