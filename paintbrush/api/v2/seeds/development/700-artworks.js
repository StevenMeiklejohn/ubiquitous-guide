
exports.seed = function(knex, Promise) {

  function create_artwork(artwork_id, artist_profile_name, owner_profile_name, artwork_type, artwork_style, artwork_material, artwork_subject, colour) {
    return knex.first()
    .from('ArtworkTypes')
    .where('Type', '=', artwork_type)
    .then(function (artwork_type) {
      return knex.first()
      .from('Styles')
      .where('Style', '=', artwork_style)
      .then(function (artwork_style) {
        return knex.first()
        .from('Materials')
        .where('Name', '=', artwork_material)
        .then(function (artwork_material) {
          return knex.first()
          .from('Subjects')
          .where('Subject', '=', artwork_subject)
          .then(function (artwork_subject) {
            return knex.first()
            .from('Profiles')
            .where({Name: artist_profile_name})
            .then(function (artist_profile) {
              return knex.first()
              .from('Profiles')
              .where({Name: artist_profile_name})
              .then(function (owner_profile) {
                console.log('artwork_type.ID:'+artwork_type.ID+'/artist_profile.ID:'+artist_profile.ID+'/'+owner_profile.ID);
                return knex('Artworks')
                .insert({
                  ID: artwork_id,
                  ArtistProfileID: artist_profile.ID,
                  OwnerProfileID: owner_profile.ID,
                  ArtworkTypeID: artwork_type.ID,
                  Name: 'Artwork Name - ' + artwork_id,
                  Description: 'Artwork Description - ' + artwork_id,
                  PricebandID: 2,
                  ImageURI: '/img/test-data/art-' + artwork_id + '.png',
                  ImageWidth: 1,
                  ImageHeight: 1,
                  Complete: 1,
                  Featured: 1
                })
                .then(function (newArtwork){
                  return knex('ArtworkStyles').insert({ ArtworkID: newArtwork[0], StyleID: artwork_style.ID })
                  .then(function(){
                    return knex('ArtworkMaterials').insert({ ArtworkID: newArtwork[0], MaterialID: artwork_material.ID })
                    .then(function(){
                      return knex('ArtworkSubjects').insert({ ArtworkID: newArtwork[0], SubjectID: artwork_subject.ID })
                      .then(function(){
                        return knex('ArtworkColours').insert({ ArtworkID: newArtwork[0], R: colour.R, G: colour.G, B: colour.B})
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  }

  // Deletes ALL existing entries
  return knex('Artworks').del().then(function() {
    return knex('ArtistMaterials').del();
  }).then(function() {
    return knex('ArtworkSubjects').del();
  }).then(function() {
    return knex('ArtworkColours').del();
  }).then(function() {
    return Promise.join(
      // Inserts seed entries
      create_artwork(1, 'Artist 1', 'Artist 1', 'Painting', 'Abstract', 'Airbrush', 'Cityscape', { R:255, G:128, B:0 }),
      create_artwork(2, 'Artist 1', 'Artist 1', 'Painting', 'Graffiti', 'Airbrush', 'Cityscape', { R:255, G:128, B:0 }),
      create_artwork(3, 'Artist 2', 'Artist 2', 'Painting', 'Impressionist', 'Bronze', 'Cityscape', { R:0, G:204, B:0 }),
      create_artwork(4, 'Artist 3', 'Artist 3', 'Painting', 'Impressionist', 'Airbrush', 'Landscape', { R:255, G:128, B:0 }),
      create_artwork(5, 'Artist 3', 'Artist 3', 'Painting', 'Abstract', 'Charcoal', 'Cityscape', { R:255, G:128, B:0 }),
      create_artwork(6, 'Artist 4', 'Artist 4', 'Painting', 'Impressionist', 'Bronze', 'Cityscape', { R:0, G:204, B:0 }),
      create_artwork(7, 'Artist 5', 'Artist 5', 'Painting', 'Erotic', 'Charcoal', 'Landscape', { R:255, G:128, B:0 }),
      create_artwork(8, 'Artist 1', 'Artist 1', 'Painting', 'Other', 'Airbrush', 'Landscape', { R:255, G:128, B:0 }),
      create_artwork(9, 'Artist 1', 'Artist 1', 'Painting', 'Abstract', 'Airbrush', 'Cityscape', { R:255, G:128, B:0 }),
      create_artwork(10, 'Artist 1', 'Artist 1', 'Painting', 'Abstract', 'Charcoal', 'Cityscape', { R:0, G:204, B:0 })

      //knex.raw('UPDATE Artworks SET Name = CONCAT("ArtworkName-", ID)')
    );
  });
};
