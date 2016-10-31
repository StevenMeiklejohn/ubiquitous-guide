exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('ArtworkLikes').del().then(function() {
    return Promise.join(
        // 2 likes today
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('NOW()'), 'ArtworkID': 1, 'ProfileID': 2 }),
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('NOW()'), 'ArtworkID': 1, 'ProfileID': 3 }),

        // 3 likes a week ago
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ArtworkID': 1, 'ProfileID': 4 }),
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ArtworkID': 1, 'ProfileID': 5 }),
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ArtworkID': 1, 'ProfileID': 6 }),

        // 2 likes 4 weeks ago ago
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ArtworkID': 1, 'ProfileID': 7 }),
        knex('ArtworkLikes').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ArtworkID': 1, 'ProfileID': 8 })
    );
  });
};
