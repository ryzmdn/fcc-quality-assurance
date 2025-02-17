const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);
let issue1;
let issue2;
suite("Functional Tests", function () {
  suite("Tests for Post method", function () {
    test("Create an issue with every field: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "issuetitle",
          issue_text: "textissue",
          created_by: "Ryzmdn",
          assigned_to: "",
          status_text: "",
        })
        .end(function (err, res) {
          issue1 = res.body;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "issuetitle");
          done();
        });
    }).timeout(20000);

    test("Create an issue with only required fields: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "issuetitle",
          issue_text: "textissue",
          created_by: "Ryzmdn",
        })
        .end(function (err, res) {
          issue2 = res.body;
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, "issuetitle");
          done();
        });
    }).timeout(20000);

    test("Create an issue with missing required fields: POST request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .post("/api/issues/apitest")
        .send({
          issue_title: "issuetitle",
          issue_text: "textissue",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "required field(s) missing");
          done();
        });
    }).timeout(20000);
  });

  suite("Tests for GET method", function () {
    test("View issues on a project: GET request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .end(function (err, res) {
          assert.equal(res.status, 200);
          done();
        });
    }).timeout(20000);

    test("View issues on a project with one filter: GET request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({ _id: issue1._id })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, issue1.issue_title);
          assert.equal(res.body[0].issue_text, issue1.issue_text);
          done();
        });
    }).timeout(20000);

    test("View issues on a project with multiple filters: GET request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .get("/api/issues/apitest")
        .query({
          issue_title: issue1.issue_title,
          issue_text: issue1.issue_text,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body[0].issue_title, issue1.issue_title);
          assert.equal(res.body[0].issue_text, issue1.issue_text);
          done();
        });
    }).timeout(20000);
  });

  suite("Tests for PUT method", function () {
    test("Update one field on an issue: PUT request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: issue1._id,
          open: false,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    }).timeout(20000);

    test("Update multiple fields on an issue: PUT request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: issue2._id,
          issue_title: "otherissuetitle",
          issue_text: "textissue",
          created_by: "Ryzmdn updated",
          assigned_to: "who",
          status_text: "stat",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.result, "successfully updated");
          done();
        });
    }).timeout(20000);

    test("Update an issue with missing _id: PUT request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          issue_title: "otherissuetitle",
          issue_text: "textissue",
          created_by: "Ryzmdn",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "missing _id");
          done();
        });
    }).timeout(20000);

    test("Update an issue with no fields to update: PUT request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: issue2._id,
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "no update field(s) sent");
          done();
        });
    }).timeout(20000);

    test("Update an issue with an invalid _id: PUT request to /api/issues/{project}", function (done) {
      chai
        .request(server)
        .keepOpen()
        .put("/api/issues/apitest")
        .send({
          _id: "5871dda29faedc3491ff93bb",
          issue_text: "testmetest",
          created_by: "Ryzmdn",
        })
        .end(function (err, res) {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, "could not update");
          done();
        });
    }).timeout(20000);

suite("Tests for DELETE method", function () {
  test("Delete an issue: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
        .send({_id: issue1._id})
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");
        done();
      });
  }).timeout(20000);

  test("Delete an issue with an invalid _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .send({ _id: issue1._id })
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");
        done();
      });
  }).timeout(20000);

  test("Delete an issue with missing _id: DELETE request to /api/issues/{project}", function (done) {
    chai
      .request(server)
      .keepOpen()
      .delete("/api/issues/apitest")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");
        done();
      });
  }).timeout(20000);
});
  });
});