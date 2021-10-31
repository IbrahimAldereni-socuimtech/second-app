import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";

import app from "../app.js";
import Comment from "../models/commentModel.js";
import sequelize from "../util/database.js";

chai.should();
chai.use(chaiHttp);

describe("test passing comment API ", () => {
  /**************************** hooks *******************************/
  // before each test i add single comment
  beforeEach(() => {
    const comment = {
      name: "comment1",
      body: "hi",
    };

    Comment.create(comment);
  });

  // after each test i delete all comments
  afterEach(() => {
    Comment.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    // to reset the sqlite id auto increment
    sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='comments'");
  });

  // after all tests i delete all comments
  after(() => {
    Comment.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    // to reset the sqlite id auto increment
    sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='comments'");
  });

  /**************************** tests *******************************/
  // GET all comments
  it("should get all comments", (done) => {
    chai
      .request(app)
      .get("/comments")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        done();
      });
  });

  // test get comment by id
  it("should get single comment by id", (done) => {
    chai
      .request(app)
      .get("/comments/" + 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("name");
        res.body.should.have.property("body");
        done();
      });
  });

  // test can't get single comment by id
  it("should not get single comment by id", (done) => {
    chai
      .request(app)
      .get("/comments/" + 10)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("comment not found");
        done();
      });
  });

  // test add comment (comment)
  it("should add a comment", (done) => {
    const comment = {
      name: "comment1",
      body: "hi",
    };
    chai
      .request(app)
      .post("/comment")
      .send(comment)
      .end((err, res) => {
        res.should.have.status(201);
        res.text.should.be.equal("comment added successfully");
        done();
      });
  });

  // test update comment (put)
  it("should update a comment", (done) => {
    const comment = {
      name: "updated-comment",
      body: "updated-body",
      userId: 1,
    };
    chai
      .request(app)
      .put("/updateComment/" + 1)
      .send(comment)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.name.should.be.eql("updated-comment");
        res.body.body.should.be.eql("updated-body");
        done();
      });
  });

  // test update non existing comment
  it("should not update a comment", (done) => {
    const comment = {
      name: "updated-comment",
      body: "updated-body",
    };
    chai
      .request(app)
      .put("/updateComment/" + 10)
      .send(comment)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("comment not found");
        done();
      });
  });

  // test delete comment (delete)
  it("should delete a comment", (done) => {
    chai
      .request(app)
      .delete("/deleteComment/" + 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.equal("comment deleted");
        done();
      });
  });

  // test delete for non existing comment
  it("should not delete a comment", (done) => {
    chai
      .request(app)
      .delete("/deleteComment/" + 10)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("comment not found");
        done();
      });
  });
});

// test catch cases
describe("test failing comment API", () => {
  // Test findAll

  it("should return error (GET all comments)", (done) => {
    const findAllStub = sinon
      .stub(Comment, "findAll")
      .returns(Promise.reject());
    chai
      .request(app)
      .get("/comments")
      .end((err, res) => {
        sinon.assert.calledWith(findAllStub);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test create
  it("should return error (add comment)", (done) => {
    const createStub = sinon.stub(Comment, "create").returns(Promise.reject());

    const comment = {
      name: "updated-comment",
      body: "updated-body",
      postId: "1",
    };
    chai
      .request(app)
      .post("/comment")
      .send(comment)
      .end((err, res) => {
        sinon.assert.calledWith(createStub, comment);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test destroy
  it("should return error (delete comment)", (done) => {
    const destroyStub = sinon
      .stub(Comment, "destroy")
      .returns(Promise.reject());
    const arg = { where: { id: "1" } };

    chai
      .request(app)
      .delete("/deleteComment/" + 1)
      .end((err, res) => {
        sinon.assert.calledWith(destroyStub, arg);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test findByPk
  it("should return error (Get single comment)", (done) => {
    const findByPkStub = sinon
      .stub(Comment, "findByPk")
      .returns(Promise.reject());
    chai
      .request(app)
      .get("/comments/" + 1)
      .end((err, res) => {
        sinon.assert.calledWith(findByPkStub, "1");
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
        findByPkStub.restore();
      });
  });

  it("should return error (update comment)", (done) => {
    const findByPkStub = sinon
      .stub(Comment, "findByPk")
      .returns(Promise.reject());

    const comment = {
      name: "updated-comment",
      body: "updated-body",
    };
    chai
      .request(app)
      .put("/updateComment/" + 1)
      .send(comment)
      .end((err, res) => {
        sinon.assert.calledWith(findByPkStub, "1");
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });
});
