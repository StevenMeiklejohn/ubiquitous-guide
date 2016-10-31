
exports.seed = function(knex, Promise) {

  function create_artist(artistID, email, profile_name, discipline_id) {
    return knex.first('ID')
              .from('Users')
              .where({Email: email})
              .then(function(user) {
                console.log('Looking for profile: '+profile_name);
                return knex.first('ID')
                          .from('Profiles')
                          .where({Name: profile_name})
                          .then(function(profile) {
                            console.log('user.ID:'+user.ID+'/profile.ID:'+profile.ID);
                            return knex('Artists')
								.insert({ ID: artistID, UserID: user.ID, ProfileID: profile.ID, DisciplineID: discipline_id });
                          });
              });
  }

  // Deletes ALL existing entries
  return knex('Artists').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      create_artist(1, 'artist1@test', 'Artist 1', 1),
      create_artist(2, 'artist2@test', 'Artist 2', 1),
      create_artist(3, 'artist3@test', 'Artist 3', 2),
      create_artist(4, 'artist4@test', 'Artist 4', 1),
      create_artist(5, 'artist5@test', 'Artist 5', 2)
    );
  });
};
