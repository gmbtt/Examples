var chai = require('chai');
var testCase = require('mocha').describe;
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

testCase('/GET posts', function(){
      it('it should GET all the posts', (done) => {
        chai.request('https://example.com')
            .get('/posts')
            .end((err, res) => {
                res.should.have.status(200);
                console.log(res.body.slice(0,3));
                res.body.should.be.a('array');
                done();
            });
      });
  });

testCase('/GET posts/:id', function(){
      it('it should GET post with id=1', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.id.should.equal(1);
                done();
            });
      });

      it('it should not GET post with id=01', (done) => {
        chai.request('https://example.com')
            .get('/posts/01')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.be.empty;
                done();
            });
      });

      it('it should not GET post with id=0x1', (done) => {
        chai.request('https://example.com')
            .get('/posts/0x1')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('object');
                res.body.should.be.empty;
                done();
            });
      });

      it('the post should have "userId" property', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('userId');
                done();
            });
      });

      it('the post should have "title" property', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('title');
                done();
            });
      });

      it('the post should have "body" property', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have.property('body');
                done();
            });
      });

      it('"userId" property should be a number', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.userId.should.be.a('number');
                done();
            });
      });

      it('"title" property should be a string', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.a('string');
                done();
            });
      });

      it('"body" property should be a string', (done) => {
        chai.request('https://example.com')
            .get('/posts/1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.body.should.be.a('string');
                done();
            });
      });
  });

testCase('/POST posts', function(){
      it('it should POST the posts', (done) => {
        chai.request('https://example.com')
            .post('/posts')
            .send({"userId": 1, "title": 'title', "body": 'body'})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.should.have.property('userId');
                res.body.should.have.property('id');
                res.body.should.have.property('title');
                res.body.should.have.property('body');
                done();
            });
      });

      it('it should generate id=101', (done) => {
        chai.request('https://example.com')
            .post('/posts')
            .send({})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.id.should.equal(101);
                done();
            });
      });

      it('it should POST right userId', (done) => {
        chai.request('https://example.com')
            .post('/posts')
            .send({"userId": 1})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.userId.should.equal(1);
                done();
            });
      });

      it('it should POST right title', (done) => {
        chai.request('https://example.com')
            .post('/posts')
            .send({"title": 'example_title'})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.title.should.equal('example_title');
                done();
            });
      });

      it('it should POST right body', (done) => {
        chai.request('https://example.com')
            .post('/posts')
            .send({"body": 'example_body'})
            .end((err, res) => {
                res.should.have.status(201);
                res.body.body.should.equal('example_body');
                done();
            });
      });
  });

testCase('/PUT posts', function(){
	  it('it should update body', (done) => {
        chai.request('https://example.com')
            .put('/posts/1')
            .send({"body": 'example_body'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.body.should.equal('example_body');
                done();
            });
      });

      it('it should return status code 422 for not found', (done) => {
        chai.request('https://example.com')
            .put('/posts/101')
            .send({"title": 'title'})
            .end((err, res) => {
                // See: https://stackoverflow.com/questions/25239565/status-code-to-return-on-not-found-sub-resource
                res.should.have.status(422);
                done();
            });
      });

      it('it should not update userId of the post', (done) => {
        chai.request('https://example.com')
            .put('/posts/1')
            .send({"userId": 'potato'})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.userId.should.be.a('number');
                done();
            });
      });

      it('it should not update title of the post', (done) => {
        chai.request('https://example.com')
            .put('/posts/1')
            .send({"title": 1})
            .end((err, res) => {
                res.should.have.status(200);
                res.body.title.should.be.a('string');
                done();
            });
      });
  });

testCase('/GET posts?userId=<id>&title=<title> smoke tests', function(){
      it('positive test for GET by query', (done) => {
        chai.request('https://example.com')
            .get('/posts?userId=1&title=nesciunt quas odio')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                const first_element = res.body[0]
                first_element.should.be.a('object');
                first_element.should.have.property('userId');
                first_element.should.have.property('id');
                first_element.should.have.property('title');
                first_element.should.have.property('body');
                first_element.userId.should.equal(1);
                first_element.title.should.equal('nesciunt quas odio');
                done();
            });
      });

      it('GET with swapped selectors', (done) => {
        chai.request('https://example.com')
            .get('/posts?title=nesciunt quas odio&userId=1')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                const first_element = res.body[0]
                first_element.should.be.a('object');
                first_element.should.have.property('userId');
                first_element.should.have.property('id');
                first_element.should.have.property('title');
                first_element.should.have.property('body');
                first_element.userId.should.equal(1);
                first_element.title.should.equal('nesciunt quas odio');
                done();
            });
      });

      it('valid userId, but invalid title', (done) => {
        chai.request('https://example.com')
            .get('/posts?userId=1&title=potato')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('array');
                res.body.should.be.empty;
                done();
            });
      });

      it('valid title, but invalid userId', (done) => {
        chai.request('https://example.com')
            .get('/posts?userId=-1&title=nesciunt quas odio')
            .end((err, res) => {
                res.should.have.status(404);
                res.body.should.be.a('array');
                res.body.should.be.empty;
                done();
            });
      });
  });