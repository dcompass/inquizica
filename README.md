# Inquizica
Hello World

Start migrating funcitonality:
Views (hbs, etc)
Auth
Quiz
Analytics/Scheduler/QM/etc...

TODO:

Functionality:
  Tests for course, quiz, question, response, analytics.
  Check views on mobile and browser (make sure api is connected).
    Finish course dashboard.
    2x knex seeds: demo page & general full-course demo.

Next steps:
  Quiz Maker
  Video and image upload

  Pages & Views
    404 & 500     /error
    Index         /
    Signup        /signup
    Login         /login
    Logout        /logout
    Admin         /admin
    Course Dash   /course/:id  -  Student and Teacher versions?
    Account       /account
    Quiz          /quiz/:id
    Scheduler     /scheduler
    Demos         /demos


  API
    /api/v1

    User login/logout (?)
    Allow course join via promo code.
    Allow quiz access via token.
    QM -> Add new

  Gulp/Grunt -> minify, lint, tests
  Bamboo, Jenkins -> Heroku,


    AUTH
    /api/login
    /api/logout -> JWT

    ACCESS
    middleware (ACL).
    Different roles w/ specific permissions.

  User ===========================================================================
  POST    /user
  GET     /user/:id
  PUT     /user/:id
  DELETE  /user/:id
  GET     /user/:id/progression?course=        - Get (user progress) given (a course).
  PUT     /user/:id/progression?course=&quiz=  - Update (user progress) given (a course, quiz).
  GET     /user/:id/next?quiz=                 - Get (next quiz) given (current quiz).
  GET     /user/:id/courses                    - Get (all user's courses).


  Course =========================================================================
  POST    /course
  GET     /course/:id
  DELETE  /course/:id
  PUT     /course/:id
  GET     /course/:id/quizzes   - Get (course's quizzes) given (a course).
  GET     /course/:id/schedule  - Get quiz schedule given course.
  GET     /course/:id/topics    - Get all quiz/chapter topics.
  PUT     /course/:id/user?id=  - Add user to course.
  PUT     /course/:id/quiz?id=  - Add quiz to course.


  Quiz ===========================================================================
  POST    /quiz
  GET     /quiz/:id
  DELETE  /quiz/:id
  PUT     /quiz/:id
  GET     /quiz/:id/analytics            - Get analytics by quiz.
  GET     /quiz/:id/questions            - Get questions by quiz.
  PUT     /quiz/:id/question?id=&index=  - Add question with index to quiz.
  PUT     /quiz/:id/record?id=           - Save records at end of quiz.


  Question =======================================================================
  POST    /question
  GET     /question/:id
  DELETE  /question/:id
  PUT     /question/:id
  GET     /question/:id/responses  - Get responses by question


  Response =======================================================================
  POST    /response
  GET     /response/:id
  DELETE  /response/:id
  PUT     /response/:id

  Record =========================================================================
  POST    /record
  GET     /record/:id
  DELETE  /record/:id
  PUT     /record/:id
