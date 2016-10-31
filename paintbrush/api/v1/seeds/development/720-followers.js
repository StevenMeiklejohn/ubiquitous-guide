exports.seed = function(knex, Promise) {
    // Deletes ALL existing entries
    return knex('Followers').del().then(function() {
        return Promise.join(
            // 4 followers today
            knex('Followers').insert({ 'created_at': knex.raw('NOW()'), 'ProfileID': 2, 'FollowingProfileID': 1 }),
            knex('Followers').insert({ 'created_at': knex.raw('NOW()'), 'ProfileID': 3, 'FollowingProfileID': 1 }),
            knex('Followers').insert({ 'created_at': knex.raw('NOW()'), 'ProfileID': 4, 'FollowingProfileID': 1 }),
            knex('Followers').insert({ 'created_at': knex.raw('NOW()'), 'ProfileID': 5, 'FollowingProfileID': 1 }),

            // 2 followers a week ago
            knex('Followers').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ProfileID': 6, 'FollowingProfileID': 1 }),
            knex('Followers').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 7 day)'), 'ProfileID': 7, 'FollowingProfileID': 1 }),

            // 2 followers 4 weeks ago
            knex('Followers').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ProfileID': 8, 'FollowingProfileID': 1 }),
            knex('Followers').insert({ 'created_at': knex.raw('DATE_SUB(NOW(), INTERVAL 1 month)'), 'ProfileID': 9, 'FollowingProfileID': 1 }),


            // following profile #2
            knex('Followers').insert({ 'ProfileID': 9, 'FollowingProfileID': 2 }),
            knex('Followers').insert({ 'ProfileID': 8, 'FollowingProfileID': 2 }),
            knex('Followers').insert({ 'ProfileID': 7, 'FollowingProfileID': 2 }),
            knex('Followers').insert({ 'ProfileID': 6, 'FollowingProfileID': 2 }),
            knex('Followers').insert({ 'ProfileID': 5, 'FollowingProfileID': 2 }),

            // followed by #1
            knex('Followers').insert({ 'ProfileID': 1, 'FollowingProfileID': 9 }),
            knex('Followers').insert({ 'ProfileID': 1, 'FollowingProfileID': 8 }),
            knex('Followers').insert({ 'ProfileID': 1, 'FollowingProfileID': 7 }),
            knex('Followers').insert({ 'ProfileID': 1, 'FollowingProfileID': 6 }),
            knex('Followers').insert({ 'ProfileID': 1, 'FollowingProfileID': 5 }),

            // followed by #2
            knex('Followers').insert({ 'ProfileID': 2, 'FollowingProfileID': 9 }),
            knex('Followers').insert({ 'ProfileID': 2, 'FollowingProfileID': 8 }),
            knex('Followers').insert({ 'ProfileID': 2, 'FollowingProfileID': 7 }),
            knex('Followers').insert({ 'ProfileID': 2, 'FollowingProfileID': 6 }),
            knex('Followers').insert({ 'ProfileID': 2, 'FollowingProfileID': 5 })
        );
    });
};
