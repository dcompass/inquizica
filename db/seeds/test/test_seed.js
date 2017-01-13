
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return Promise.all([
    knex('user').del(),
    knex('course').del(),
    knex('user_course').del()
  ]).then(function () {
    return Promise.all([
      knex('user').insert({
        id: 1,
        firstname: "Sean",
        lastname: "Lynch",
        phone: "610-675-4305",
        email: "seanjcrl@gmail.com",
        password: "password123",
        affiliation: "Inquizica",
        type: 3
      }),
      knex('course').insert({
        id: 1,
        title: "Biology 101",
        description: "Intro to biology, highschool.",
        author: "Dr. Miller",
        affiliation: "Inquizica"
      }),
      knex('course').insert({
        id: 2,
        title: "Computer Science 101",
        description: "Intro to comp sci, college.",
        author: "Sean",
        affiliation: "Inquizica"
      }),
      knex('user_course').insert({
        user_id: 1,
        course_id: 1,
        progression: JSON.stringify([1, 0, 0 ,0])
      }),
      knex('user_course').insert({
        user_id: 1,
        course_id: 2,
        progression: JSON.stringify([1, 1, 0])
      })
    ])
  })
  // return knex('user').del()
  //   .then(function () {
  //     return knex('user').insert({
  //       id: 1,
  //       firstname: "Sean",
  //       lastname: "Lynch",
  //       phone: "610-675-4305",
  //       email: "seanjcrl@gmail.com",
  //       password: "password123",
  //       affiliation: "Inquizica",
  //       type: 3
  //     });
  //   });
};
