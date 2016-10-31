exports.seed = function(knex, Promise) {

  // Deletes ALL existing entries
  return knex('ShortlistArtists').del().then(function() {
    return Promise.join(
      // 1 shortlisted today
      knex('ShortlistArtists').insert({ 'created_at': knex.raw('NOW()'), 'ShortlistID': 2, 'ArtistID': 1 }),

      // 2 shortlisted a week ago
      knex('ShortlistArtists').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ShortlistID': 3, 'ArtistID': 2 }),
      knex('ShortlistArtists').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ShortlistID': 4, 'ArtistID': 2 }),

      // 3 shortlisted 4 weeks ago
      knex('ShortlistArtists').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 4 week)'), 'ShortlistID': 5, 'ArtistID': 1 }),
      knex('ShortlistArtists').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 4 week)'), 'ShortlistID': 6, 'ArtistID': 2 }),
      knex('ShortlistArtists').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 4 week)'), 'ShortlistID': 7, 'ArtistID': 1 })
    );
  });
};
