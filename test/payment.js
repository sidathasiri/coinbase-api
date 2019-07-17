const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../server");
const should = chai.should();

chai.use(chaiHttp);

describe("/POST payments/create-charge", () => {
  it("it should contain pricing, addresses and charge code", done => {
    let data = {
      amount: 87
    };
    chai
      .request(server)
      .post("/payments/create-charge")
      .send(data)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        res.body.should.have.property("pricing");
        res.body.should.have.property("addresses");
        res.body.should.have.property("code");
        res.body.pricing.local.amount.should.equal("87.00");
        done();
      });
  });
});

describe("/POST payments/create-charge", () => {
  it("it should throw error when requred data (amount) is not included in request", done => {
    let data = {};
    chai
      .request(server)
      .post("/payments/create-charge")
      .send(data)
      .end((err, res) => {
        res.body.should.have.property("error");
        res.body.error.should.equal("Amount is not included in the request");
        done();
      });
  });
});

describe("/POST payments/create-charge", () => {
  it("it should throw error when requred data (amount) is not a number", done => {
    let data = {
      amount: "eight"
    };
    chai
      .request(server)
      .post("/payments/create-charge")
      .send(data)
      .end((err, res) => {
        res.body.should.have.property("error");
        res.body.error.should.equal("Local price must be greater than 0");
        done();
      });
  });
});
