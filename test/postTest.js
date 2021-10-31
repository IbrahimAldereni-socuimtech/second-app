import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";

import app from "../app.js";
import Post from "../models/postModel.js";
import sequelize from "../util/database.js";

chai.should();
chai.use(chaiHttp);

describe("test passing post API ", () => {
  /**************************** hooks *******************************/
  // before each test i add single post
  beforeEach(() => {
    const post = {
      title: "post1",
      body: "hi",
    };

    Post.create(post);
  });

  // after each test i delete all posts
  afterEach(() => {
    Post.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    // to reset the sqlite id auto increment
    sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='posts'");
  });

  // after all tests i delete all posts
  after(() => {
    Post.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    // to reset the sqlite id auto increment
    sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='posts'");
  });

  /**************************** tests *******************************/
  // GET all posts
  it("should get all posts", (done) => {
    chai
      .request(app)
      .get("/posts")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        done();
      });
  });

  // test get post by id
  it("should get single post by id", (done) => {
    chai
      .request(app)
      .get("/posts/" + 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("title");
        res.body.should.have.property("body");
        done();
      });
  });

  // test can't get single post by id
  it("should not get single post by id", (done) => {
    chai
      .request(app)
      .get("/posts/" + 10)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("post not found");
        done();
      });
  });

  // test add post (post)
  it("should add a post", (done) => {
    const post = {
      title: "post1",
      body: "hi",
    };
    chai
      .request(app)
      .post("/post")
      .send(post)
      .end((err, res) => {
        res.should.have.status(201);
        res.text.should.be.equal("post added successfully");
        done();
      });
  });

  // test update post (put)
  it("should update a post", (done) => {
    const post = {
      title: "updated-post",
      body: "updated-body",
      userId: 1,
    };
    chai
      .request(app)
      .put("/updatePost/" + 1)
      .send(post)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.title.should.be.eql("updated-post");
        res.body.body.should.be.eql("updated-body");
        done();
      });
  });

  // test update non existing post
  it("should not update a post", (done) => {
    const post = {
      title: "updated-post",
      body: "updated-body",
    };
    chai
      .request(app)
      .put("/updatePost/" + 10)
      .send(post)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("post not found");
        done();
      });
  });

  // test delete post (delete)
  it("should delete a post", (done) => {
    chai
      .request(app)
      .delete("/deletePost/" + 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.equal("post deleted");
        done();
      });
  });

  // test delete for non existing post
  it("should not delete a post", (done) => {
    chai
      .request(app)
      .delete("/deletePost/" + 10)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("post not found");
        done();
      });
  });
});

// test catch cases
describe("test failing post API", () => {
  // Test findAll

  it("should return error (GET all posts)", (done) => {
    const findAllStub = sinon.stub(Post, "findAll").returns(Promise.reject());
    chai
      .request(app)
      .get("/posts")
      .end((err, res) => {
        sinon.assert.calledWith(findAllStub);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test create
  it("should return error (add post)", (done) => {
    const createStub = sinon.stub(Post, "create").returns(Promise.reject());

    const post = {
      title: "updated-post",
      body: "updated-body",
      userId: "1",
    };
    chai
      .request(app)
      .post("/post")
      .send(post)
      .end((err, res) => {
        sinon.assert.calledWith(createStub, post);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test destroy
  it("should return error (delete post)", (done) => {
    const destroyStub = sinon.stub(Post, "destroy").returns(Promise.reject());
    const arg = { where: { id: "1" } };

    chai
      .request(app)
      .delete("/deletePost/" + 1)
      .end((err, res) => {
        sinon.assert.calledWith(destroyStub, arg);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test findByPk
  it("should return error (Get single post)", (done) => {
    const findByPkStub = sinon.stub(Post, "findByPk").returns(Promise.reject());
    chai
      .request(app)
      .get("/posts/" + 1)
      .end((err, res) => {
        sinon.assert.calledWith(findByPkStub, "1");
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
        findByPkStub.restore();
      });
  });

  it("should return error (update post)", (done) => {
    const findByPkStub = sinon.stub(Post, "findByPk").returns(Promise.reject());

    const post = {
      title: "updated-post",
      body: "updated-body",
    };
    chai
      .request(app)
      .put("/updatePost/" + 1)
      .send(post)
      .end((err, res) => {
        sinon.assert.calledWith(findByPkStub, "1");
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });
});
