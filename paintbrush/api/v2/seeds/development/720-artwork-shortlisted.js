exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ShortlistArtworks').del().then(function() {
    return Promise.join(
        // 1 shortlisted today
        knex('ShortlistArtworks').insert({ 'created_at': knex.raw('NOW()'), 'ShortlistID': 12, 'ArtworkID': 1 }),

        // 2 shortlisted a week ago
        knex('ShortlistArtworks').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ShortlistID': 13, 'ArtworkID': 2 }),
        knex('ShortlistArtworks').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ShortlistID': 14, 'ArtworkID': 2 }),

        // 3 shortlisted 4 weeks ago
        knex('ShortlistArtworks').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ShortlistID': 15, 'ArtworkID': 1 }),
        knex('ShortlistArtworks').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ShortlistID': 16, 'ArtworkID': 2 }),
        knex('ShortlistArtworks').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ShortlistID': 17, 'ArtworkID': 1 })
    );
  });
};
