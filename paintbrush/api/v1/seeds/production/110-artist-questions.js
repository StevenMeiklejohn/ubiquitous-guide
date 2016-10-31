exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtistQuestions').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      knex('ArtistQuestions').insert({ ID: 1, TypeID: 1, Priority: 100, Text: 'What is particularly unique about where you work?' }),
      knex('ArtistQuestions').insert({ ID: 2, TypeID: 1, Priority: 95, Text: 'Is there anything unusual about how you start your day?' }),
      knex('ArtistQuestions').insert({ ID: 3, TypeID: 1, Priority: 90, Text: 'Do you use any interesting mediums or materials? If so why?' }),
      knex('ArtistQuestions').insert({ ID: 4, TypeID: 1, Priority: 85, Text: 'Is there anything specific about the way create your art that is unique to you?' }),
      knex('ArtistQuestions').insert({ ID: 5, TypeID: 1, Priority: 80, Text: 'Have you created any specific processes that only you use?' }),
      knex('ArtistQuestions').insert({ ID: 6, TypeID: 2, Priority: 100, Text: 'What specific movements or artists have inspured your art the most?' }),
      knex('ArtistQuestions').insert({ ID: 7, TypeID: 2, Priority: 95, Text: 'What pivotal life experiences have most influenced your art?' }),
      knex('ArtistQuestions').insert({ ID: 8, TypeID: 2, Priority: 90, Text: 'In 3 sentences, describe how you have ended up where you are today? What has been your journey?' }),
      knex('ArtistQuestions').insert({ ID: 9, TypeID: 2, Priority: 85, Text: 'What interesting places have influenced your art and why?' }),
      knex('ArtistQuestions').insert({ ID: 10, TypeID: 2, Priority: 80, Text: 'What specific emotions are you trying to express through your artwork?' }),
      knex('ArtistQuestions').insert({ ID: 11, TypeID: 3, Priority: 100, Text: 'Describe the type of buyer that is most likely to enjoy your work?' })
    );
  });
};
