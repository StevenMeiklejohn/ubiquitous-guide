
exports.seed = function(knex, Promise) {

  function create_gallery(profile_name) {
    return knex.first('*')
              .from('Profiles')
              .where({Name: profile_name})
              .then(function(profile) {
                console.log('profile.ID:'+profile.ID);
                return knex('Galleries')
                          .insert({ProfileID: profile.ID});
              });
  }

  function create_gallery_user(email, profile_name) {
    return knex.first('g.*')
              .from('Profiles AS p')
              .join('Galleries AS g', 'p.ID', 'g.ProfileID')
             .where('p.Name', '=', profile_name)
              .then(function(gallery) {
                return knex.first('Users.ID')
                          .from('Users')
                          .where({Email: email})
                          .then(function(user) {
                            console.log('user.ID:'+user.ID+'/gallery.ID:'+gallery.ID);
                            return knex('GalleryUsers')
                                      .insert({UserID: user.ID, GalleryID: gallery.ID});
                          });
              });
  }

  // Deletes ALL existing entries
  return knex('Galleries').del().then(function() {
    return knex('GalleryUsers').del().then(function() {
      return Promise.join(
        // Inserts seed entries
        create_gallery('Gallery 1'),
        create_gallery('Gallery 2'),
        create_gallery('Gallery 3'),
        create_gallery('Gallery 4')
      ).then(function() {
        // Only after the galleries are created can we insert the gallery users
        return Promise.join(
                  create_gallery_user('gallery1@test', 'Gallery 1'),
                  create_gallery_user('gallery2@test', 'Gallery 2'),
                  create_gallery_user('gallery3a@test', 'Gallery 3'),
                  create_gallery_user('gallery3b@test', 'Gallery 3'),
                  create_gallery_user('gallery4@test', 'Gallery 4')
        )
      });
    });
  });
};
