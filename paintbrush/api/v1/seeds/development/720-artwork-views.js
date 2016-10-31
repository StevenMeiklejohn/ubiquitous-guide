exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('AnalyticEvents').del().then(function() {
    return Promise.join(
        // 3 views today
        knex('AnalyticEvents').insert({ 'created_at': knex.raw('NOW()'), 'EventID': 7, 'ArtworkID': 3, 'ArtistID': 2, ProfileID: 2, 'UserProfileID': 2, 'UserID': 2 }),
        knex('AnalyticEvents').insert({ 'created_at': knex.raw('NOW()'), 'EventID': 7, 'ArtworkID': 3, 'ArtistID': 2, ProfileID: 2, 'UserProfileID': 3, 'UserID': 3 }),
        knex('AnalyticEvents').insert({ 'created_at': knex.raw('NOW()'), 'EventID': 7, 'ArtworkID': 3, 'ArtistID': 2, ProfileID: 2, 'UserProfileID': 4, 'UserID': 4 }),

        // 2 views a week ago
        knex('AnalyticEvents').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'EventID': 7, 'ArtworkID': 3, 'ArtistID': 2, ProfileID: 2, 'UserProfileID': 5, 'UserID': 5 }),
        knex('AnalyticEvents').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'EventID': 7, 'ArtworkID': 3, 'ArtistID': 2, ProfileID: 2, 'UserProfileID': 6, 'UserID': 6 }),

        // 1 view 4 weeks ago
        knex('AnalyticEvents').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'EventID': 7, 'ArtworkID': 3, 'ArtistID': 2, ProfileID: 2, 'UserProfileID': 7, 'UserID': 7 })
    );
  });
};
