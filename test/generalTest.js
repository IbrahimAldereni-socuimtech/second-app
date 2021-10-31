import chai from "chai";
import chaiHttp from "chai-http";

import app from "../app.js";

chai.should();
chai.use(chaiHttp);

describe("home and 404 test", () => {
  // test server homepage
  it("should get home page", (done) => {
    chai
      .request(app)
      .get("/")
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.eql("Home Page");
        done();
      });
  });

  // test 404 page
  it("should get 404 page", (done) => {
    chai
      .request(app)
      .get("/ddd")
      .end((err, res) => {
        res.should.have.status(404);
        res.text.should.be.eql("Page not found");
        done();
      });
  });
});
