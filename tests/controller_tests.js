process.env.NODE_ENV = 'test';

var knex = require('../db/knex.js');
var expect = require("chai").expect;
var request = require('supertest');
var app = require('../app.js');
var student = request.agent(app);


describe('API Controller:', function () {

  beforeEach(function (done) {
    knex.migrate.rollback()
    .then(function () {
      knex.migrate.latest()
      .then(function () {
        return knex.seed.run()
        .then(function () {
          done();
        });
      });
    });
  });

  afterEach(function (done) {
    setTimeout(done(), 1000);
  })

  describe('User', function () {
    it("[POST /user] should issue 301 redirect on success", function (done) {
      var user = {
        firstname: "Sean",
        lastname: "Lynch",
        phone: "610-675-4305",
        email: "seanjcrl@gmail.com",
        password: "password",
        affiliation: "Inquizica",
        type: 3
      };
      request(app)
        .post('/api/user')
        .send(user)
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/account');
          done();
        });
    });
    it("[POST /user] should issue 400 bad request on incomplete form data", function (done) {
      var user2 = {
        firstname: "Sean",
        lastname: "Lynch",
        // No Phone
        email: "seanjcrl@gmail.com",
        password: "password",
        affiliation: "Inquizica",
        type: 3
      };
      request(app)
        .post('/api/user')
        .send(user2)
        .expect(400)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/signup');
          done();
        });
    });
    // TODO: Check all fields are present.
    it('[GET /user/:id] should issue 200 with json for existing user', function (done) {
      request(app)
        .get('/api/user/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        });
    })
    it('[GET /user/:id] should issue 404 with json if user does not exist', function (done) {
      request(app)
        .get('/api/user/919191')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          done();
        })
    })
    // TODO: Implement UPDATE operations.
    // TODO: Should tests if delete deletes all related entires.
    it('[DELETE /user/:id] should issue 200 for existing user', function (done) {
      request(app)
        .delete('/api/user/1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[DELETE /user/:id] should issue 404 if user does not exist', function (done) {
      request(app)
        .delete('/api/user/919191')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /user/:id/progression] should issue 200 with json on success', function (done) {
      request(app)
        .get('/api/user/1/progression?course=1')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.array;
          expect(res.body).to.have.lengthOf(4);
          done();
        });
    });
    it('[GET /user/:id/progression] should issue 404 with json if user/course does not exist ', function (done) {
      request(app)
        .get('/api/user/1/progression?course=818181')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.an.array;
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });
    it('[PUT /user/:id/progression] should issue 200 when updated successfully', function (done) {
      request(app)
        .put('/api/user/1/progression?course=1')
        .send({progression: [1, 1, 0, 0] })
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: Should check existence of user/course better.
    it('[PUT /user/:id/progression] should issue 404 if user does not exist', function (done) {
      request(app)
        .put('/api/user/919191/progression?course=1')
        .send({progression: [1, 1, 0, 0] })
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    // TODO: Implement "next", .get('/user/1/next?quiz=1')
    // it('[GET /user/:id/next] should issue 200 with json on success');
    it("[GET /user/:id/courses] should issue 200 with json when successful", function (done) {
      request(app)
        .get('/api/user/1/courses')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          expect(res.body).to.have.lengthOf(2);
          done();
        });
    });
    it("[GET /user/:id/courses] should issue 404 with json when user does not exist", function (done) {
      request(app)
        .get('/api/user/818181/courses')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.be.json;
          expect(res.body).to.have.lengthOf(0);
          done();
        });
    });
  });

  describe("Auth", function () {
    // TODO: SALT AND HASH PASSWORDS!!!!
    it('[GET /account] should issue 403 when user is not logged in', function (done) {
      student
        .get('/account')
        .expect(403)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /login] should issue 301 redirect to /account when successful', function (done) {
      student
        .post('/api/auth/login')
        .send({email: 'seanjcrl@gmail.com', passwd: 'password123' })
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.headers['location']).to.equal('/account');
          done();
        });
    });
    it('[GET /account] should issue 200 when user is logged in', function (done) {
      student
        .get('/account')
        .expect(200)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
    it('[POST /logout] should issue 301 redirect to / when successfully logged out', function (done) {
      student
        .post('/api/auth/logout')
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it('[GET /account] should issue 403 after user is logged out', function (done) {
      student
        .get('/account')
        .expect(403)
        .end(function (err) {
          if (err) return done(err);
          done();
        });
    });
  });

  // describe('Course', function () {
  //   it("should CREATE a new course", function (done) {
  //     request(app)
  //       .post('/course')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given course", function (done) {
  //     request(app)
  //       .get('/course/2')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given course", function (done) {
  //     request(app)
  //       .put('/course/2')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given course", function (done) {
  //     request(app)
  //       .delete('/course/2')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ the quizzes of a given course");
  //   it("should READ the schedule of a given course");
  //   it("should READ the topics of a given course");
  //   it("should ADD a user to a given course");
  //   it("should ADD a quiz to a given course");
  // });


  // describe('Quiz', function () {
  //   it("should CREATE a new quiz", function (done) {
  //     request(app)
  //       .post('/quiz')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given quiz", function (done) {
  //     request(app)
  //       .get('/quiz/3')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given quiz", function (done) {
  //     request(app)
  //       .put('/quiz/3')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given quiz", function (done) {
  //     request(app)
  //       .delete('/quiz/3')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ the analytics of a given quiz");
  //   it("should READ the questions of a given quiz");
  //   it("should ADD a question to a given quiz");
  //   it("should CREATE a new quiz record");
  // });

  // describe('Question', function () {
  //   it("should CREATE a new question", function (done) {
  //     request(app)
  //       .post('/question')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given question", function (done) {
  //     request(app)
  //       .get('/question/4')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given question", function (done) {
  //     request(app)
  //       .put('/question/4')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given question", function (done) {
  //     request(app)
  //       .delete('/question/4')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ responses for a given question");
  // });

  // describe('Response', function () {
  //   it("should CREATE a new response", function (done) {
  //     request(app)
  //       .post('/response')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should READ a given response", function (done) {
  //     request(app)
  //       .get('/response/5')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should UPDATE a given response", function (done) {
  //     request(app)
  //       .put('/response/5')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  //   it("should DESTROY a given response", function (done) {
  //     request(app)
  //       .delete('/response/5')
  //       .expect(200)
  //       .end(function (err, res) {
  //         if (err) return done(err);
  //         done();
  //       });
  //   });
  // });

})

describe("View Controller", function () {
  describe("Error Pages", function () {
    it("should send 404 if page does not exist", function (done) {
      request(app)
        .get('/doesNotExist')
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
  });
  describe("Index Page", function () {
    it("[GET /] should send 200 for anyone", function (done) {
      request(app)
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    });
    it("[GET /] should send 200 for students", function (done) {
      student
        .get('/')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    })
  });
  describe("Signup Page", function () {
    it("[GET /signup] should issue 200 for anyone", function (done) {
      request(app)
        .get('/signup')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          done();
        });
    })
    it("[GET /signup] should issue 301 redirect to / for students", function (done) {
      student
        .get('/signup')
        .expect(301)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.header['location']).equals('/');
          done();
        });
    })
  });
  describe("Login Page", function () {
    it("should be tested");
  });
  // describe("Admin Page", function () {
  //   it("should be tested");
  // });
  // describe("Course Dashboard", function () {
  //   it("should be tested");
  // });
  // describe("User Dashboard", function () {
  //   it("should be tested");
  // });
  // describe("Quiz Page", function () {
  //   it("should be tested");
  // });
  // describe("Scheduler Page", function () {
  //   it("should be tested");
  // });
  // describe("Demo Page", function () {
  //   it("should be tested");
  // });
})


// describe('GET /user/:id', function () {
//   it("should return a single user", function (done) {
//     request(app)
//       .get('/user/1')
//       .expect(200)
//       .end(function (err, res) {
//         expect(res).to.be.json;
//         expect(res.body[0]).to.have.property('phone');
//         expect(res.body[0]).to.have.property('type');
//         done();
//       });
//   });
// });
