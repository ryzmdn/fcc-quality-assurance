const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  test("#example Test GET /api/books", function (done) {
    chai
      .request(server)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          const correctBookTitle = "POST Test Book";
          chai
            .request(server)
            .post("/api/books")
            .send({ title: correctBookTitle })
            .end(function (err, res) {
              assert.equal(res.body.title, correctBookTitle);
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        const correctBookTitle = "GET Test Book";
        chai
          .request(server)
          .post("/api/books")
          .send({ title: correctBookTitle })
          .end(function (err, res) {
            assert.equal(res.body.title, correctBookTitle);
            const bookId = res.body._id;
            chai
              .request(server)
              .get(`/api/books/${bookId}`)
              .send({})
              .end(function (err, res) {
                assert.deepEqual(res.body.comments, []); // Make sure no comments yet
                done();
              });
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server)
          .get("/api/books/badId")
          .send({})
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        let correctResObj = {
          title: "GET Test Book",
          comments: [],
        };

        chai
          .request(server)
          .post("/api/books")
          .send({ title: correctResObj.title })
          .end(function (err, res) {
            correctResObj._id = res.body._id;

            chai
              .request(server)
              .get(`/api/books/${correctResObj._id}`)
              .send({})
              .end(function (err, res) {
                delete res.body.__v;

                assert.deepEqual(res.body, correctResObj);
                done();
              });
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        test("Test POST /api/books/[id] with comment", function (done) {
          const bookTitle = "POST No Comment Test Book";
          chai
            .request(server)
            .post("/api/books")
            .send({ title: bookTitle })
            .end(function (err, res) {
              let bookId = res.body._id;

              chai
                .request(server)
                .post(`/api/books/${bookId}`)
                .send({})
                .end(function (err, res) {
                  assert.equal(res.text, "missing required field comment");
                  done();
                });
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          // Create book to add comment to
          const bookTitle = "POST Comment Test Book";
          const correctComments = ["this is a test"];
          chai
            .request(server)
            .post("/api/books")
            .send({ title: bookTitle })
            .end(function (err, res) {
              let bookId = res.body._id;

              chai
                .request(server)
                .post(`/api/books/${bookId}`)
                .send({ comment: correctComments[0] })
                .end(function (err, res) {
                  assert.deepEqual(res.body.comments, correctComments);
                  done();
                });
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server)
            .post("/api/books/badId")
            .send({})
            .end(function (err, res) {
              assert.equal(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        const bookTitle = "DELETE Test Book";

        // Create book to delete
        chai
          .request(server)
          .post("/api/books")
          .send({ title: bookTitle })
          .end(function (err, res) {
            const bookId = res.body._id;
            assert.equal(res.body.title, bookTitle);

            chai
              .request(server)
              .delete(`/api/books/${bookId}`)
              .send({})
              .end(function (err, res) {
                assert.equal(res.text, "delete successful");
                done();
              });
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server)
          .delete("/api/books/badId")
          .send({})
          .end(function (err, res) {
            assert.equal(res.text, "no book exists");
          });
        done();
      });
    });
  });
});
