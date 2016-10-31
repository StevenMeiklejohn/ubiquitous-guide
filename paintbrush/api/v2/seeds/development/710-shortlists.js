exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('Shortlists').del().then(function() {
    return knex('ShortlistArtists').del();
  }).then(function() {
    return Promise.join(
      // Inserts seed entries
    	knex('Shortlists').insert({ ID: 1, ProfileID: 1, Name: 'Test Shortlist 1', Description: 'Shortlist of Artists 1', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 2, ProfileID: 2, Name: 'Test Shortlist 2', Description: 'Shortlist of Artists 2', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 3, ProfileID: 3, Name: 'Test Shortlist 3', Description: 'Shortlist of Artists 3', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 4, ProfileID: 4, Name: 'Test Shortlist 4', Description: 'Shortlist of Artists 4', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 5, ProfileID: 5, Name: 'Test Shortlist 5', Description: 'Shortlist of Artists 5', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 6, ProfileID: 6, Name: 'Test Shortlist 6', Description: 'Shortlist of Artists 6', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 7, ProfileID: 7, Name: 'Test Shortlist 7', Description: 'Shortlist of Artists 7', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 8, ProfileID: 8, Name: 'Test Shortlist 8', Description: 'Shortlist of Artists 8', TypeID: 1 }),
    	knex('Shortlists').insert({ ID: 9, ProfileID: 9, Name: 'Test Shortlist 9', Description: 'Shortlist of Artists 9', TypeID: 1 }),

    	knex('Shortlists').insert({ ID: 11, ProfileID: 9, Name: 'Test Shortlist 11', Description: 'Shortlist of Artworks 11', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 12, ProfileID: 8, Name: 'Test Shortlist 12', Description: 'Shortlist of Artworks 12', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 13, ProfileID: 7, Name: 'Test Shortlist 13', Description: 'Shortlist of Artworks 13', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 14, ProfileID: 6, Name: 'Test Shortlist 14', Description: 'Shortlist of Artworks 14', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 15, ProfileID: 5, Name: 'Test Shortlist 15', Description: 'Shortlist of Artworks 15', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 16, ProfileID: 4, Name: 'Test Shortlist 16', Description: 'Shortlist of Artworks 16', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 17, ProfileID: 3, Name: 'Test Shortlist 17', Description: 'Shortlist of Artworks 17', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 18, ProfileID: 2, Name: 'Test Shortlist 18', Description: 'Shortlist of Artworks 18', TypeID: 2 }),
    	knex('Shortlists').insert({ ID: 19, ProfileID: 1, Name: 'Test Shortlist 19', Description: 'Shortlist of Artworks 19', TypeID: 2 })
    );
  });
}