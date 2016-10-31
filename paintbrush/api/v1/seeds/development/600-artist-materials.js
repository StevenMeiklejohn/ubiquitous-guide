
exports.seed = function(knex, Promise) {

  function create_artist_materials(email, material_name) {
    return knex.first('a.*')
              .from('Artists AS a')
              .join('Users AS u', 'a.UserID', 'u.ID')
             .where('u.Email', '=', email)
              .then(function(user) {
                return knex.first()
                          .from('Materials')
                          .where({Name: material_name})
                          .then(function(material) {
                            console.log('user.ID:'+user.ID+'/material.ID:'+material.ID);
                            return knex('ArtistMaterials')
                                      .insert({ArtistID: user.ID, MaterialID: material.ID});
                          });
              });
  }

  // Deletes ALL existing entries
  return knex('ArtistMaterials').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      create_artist_materials('artist1@test', 'Bamboo charcoal'),
      create_artist_materials('artist2@test', 'Gallery wrap'),
      create_artist_materials('artist3@test', 'Eraser'),
      create_artist_materials('artist4@test', 'Photography'),
      create_artist_materials('artist5@test', 'Wasli'),
      create_artist_materials('artist3@test', 'Acrylic paint'),
      create_artist_materials('artist4@test', 'Drafting tape'),
      create_artist_materials('artist5@test', 'Oil pastel')
    );
  });
};
