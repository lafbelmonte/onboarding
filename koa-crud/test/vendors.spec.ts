import chai from 'chai';
import chaiHttp from 'chai-http';

import server from '../src/index';

import { Vendor } from '../src/mongoose/models/vendor';

const should = chai.should();
chai.use(chaiHttp);

describe('POST /vendors', () => {
  afterEach(() => {
    return Vendor.deleteMany({});
  });

  it('should successfully insert a vendor', (done) => {
    chai
      .request(server.callback())
      .post('/vendors')
      .send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(201);
        done();
      });
  });

  it('should throw an error if no id is given', (done) => {
    chai
      .request(server.callback())
      .post('/vendors')
      .send({
        _id: null,
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(400);
        done();
      });
  });

  it('should throw an error if no name is given', (done) => {
    chai
      .request(server.callback())
      .post('/vendors')
      .send({
        _id: '154151546',
        name: null,
        type: 'SEAMLESS',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(400);
        done();
      });
  });

  it('should throw an error if no type is given', (done) => {
    chai
      .request(server.callback())
      .post('/vendors')
      .send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: null,
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(400);
        done();
      });
  });

  it('should throw an error if invalid type is given', (done) => {
    chai
      .request(server.callback())
      .post('/vendors')
      .send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: 'qwe',
      })
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(400);
        done();
      });
  });

  it('should throw an error if id already exists', (done) => {
    chai
      .request(server.callback())
      .post('/vendors')
      .send({
        _id: '154151546',
        name: 'Luis Angelo Belmonte',
        type: 'SEAMLESS',
      })
      .then(() => {
        chai
          .request(server.callback())
          .post('/vendors')
          .send({
            _id: '154151546',
            name: 'Luis Angelo Belmonte',
            type: 'SEAMLESS',
          })
          .end((err, res) => {
            should.not.exist(err);
            res.status.should.eql(400);
            done();
          });
      });
  });
});

describe('GET /vendors', () => {
  it('should test', (done) => {
    chai
      .request(server.callback())
      .get('/vendors')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        done();
      });
  });
});

describe('GET /vendors/:id', () => {
  it('should test', (done) => {
    chai
      .request(server.callback())
      .get('/vendors/1')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(200);
        done();
      });
  });
});

describe('PUT /vendors/:id', () => {
  it('should test', (done) => {
    chai
      .request(server.callback())
      .put('/vendors/1')
      .end((err, res) => {
        should.not.exist(err);
        res.status.should.eql(204);
        done();
      });
  });
});
