import chai from "chai";
import chaiHttp from "chai-http";
import sinon from "sinon";

import app from "../app.js";
import User from "../models/userModel.js";
import sequelize from "../util/database.js";

chai.should();
chai.use(chaiHttp);

describe("test passing user API ", () => {
  /**************************** hooks *******************************/
  // before each test i add single user
  beforeEach(() => {
    const user = {
      name: "test-user",
      email: "test@test.com",
    };

    User.create(user);
  });

  // after each test i delete all users
  afterEach(() => {
    User.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    // to reset the sqlite id auto increment
    sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='users'");
  });

  // after all tests i delete all users
  after(() => {
    User.destroy({
      where: {},
      truncate: true,
      restartIdentity: true,
    });

    // to reset the sqlite id auto increment
    sequelize.query("UPDATE SQLITE_SEQUENCE SET SEQ=0 WHERE NAME='users'");
    sinon.reset();
    sinon.restore();
  });

  /**************************** tests *******************************/
  // GET all users
  it("should get all users", (done) => {
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("array");
        res.body.length.should.be.eql(1);
        done();
      });
  });

  // test get user by id
  it("should get single user by id", (done) => {
    chai
      .request(app)
      .get("/users/" + 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("id");
        res.body.should.have.property("name");
        res.body.should.have.property("email");
        done();
      });
  });

  // test can't get single user by id
  it("should not get single user by id", (done) => {
    chai
      .request(app)
      .get("/users/" + 10)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("user not found");
        done();
      });
  });

  // test add user (post)
  it("should add a user", (done) => {
    const user = {
      name: "test-user",
      email: "test@test.com",
    };
    chai
      .request(app)
      .post("/user")
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        res.text.should.be.equal("user added successfully");
        done();
      });
  });

  // test update user (put)
  it("should update a user", (done) => {
    const user = {
      name: "updated-user",
      email: "updated-email",
    };
    chai
      .request(app)
      .put("/updateUser/" + 1)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.name.should.be.eql("updated-user");
        res.body.email.should.be.eql("updated-email");
        done();
      });
  });

  // test update non existing user
  it("should not update a user", (done) => {
    const user = {
      name: "updated-user",
      email: "updated-email",
    };
    chai
      .request(app)
      .put("/updateUser/" + 10)
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("user not found");
        done();
      });
  });

  // test delete user (delete)
  it("should delete a user", (done) => {
    chai
      .request(app)
      .delete("/deleteUser/" + 1)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.equal("user deleted");
        done();
      });
  });

  // test delete for non existing user
  it("should not delete a user", (done) => {
    chai
      .request(app)
      .delete("/deleteUser/" + 10)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.text.should.be.equal("user not found");
        done();
      });
  });
});

// test catch cases
describe("test failing user API", () => {
  // Test findAll

  it("should return error (GET all users)", (done) => {
    const findAllStub = sinon.stub(User, "findAll").returns(Promise.reject());
    chai
      .request(app)
      .get("/users")
      .end((err, res) => {
        sinon.assert.calledWith(findAllStub);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test create

  it("should return error (add user)", (done) => {
    const createStub = sinon.stub(User, "create").returns(Promise.reject());
    const user = {
      name: "test-user",
      email: "test@test.com",
    };
    chai
      .request(app)
      .post("/user")
      .send(user)
      .end((err, res) => {
        sinon.assert.calledWith(createStub, user);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test destroy
  it("should return error (delete user)", (done) => {
    const destroyStub = sinon.stub(User, "destroy").returns(Promise.reject());
    const arg = { where: { id: "1" } };

    chai
      .request(app)
      .delete("/deleteUser/" + 1)
      .end((err, res) => {
        sinon.assert.calledWith(destroyStub, arg);
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });

  // test findByPk
  it("should return error (Get single user)", (done) => {
    const findByPkStub = sinon.stub(User, "findByPk").returns(Promise.reject());
    chai
      .request(app)
      .get("/users/" + 1)
      .end((err, res) => {
        sinon.assert.calledWith(findByPkStub, "1");
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
        findByPkStub.restore();
      });
  });

  it("should return error (update user)", (done) => {
    const findByPkStub = sinon.stub(User, "findByPk").returns(Promise.reject());

    const user = {
      name: "updated-user",
      email: "updated-email",
    };

    chai
      .request(app)
      .put("/updateUser/" + 1)
      .send(user)
      .end((err, res) => {
        sinon.assert.calledWith(findByPkStub, "1");
        res.should.have.status(500);
        res.text.should.be.equal("error");
        done();
      });
  });
});
