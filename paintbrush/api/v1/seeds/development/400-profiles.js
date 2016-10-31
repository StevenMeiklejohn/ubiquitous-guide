
exports.seed = function(knex, Promise) {

  function create_profile(offset, profile_name, image_url, biography_id) {
    console.log('Creating profile for: '+profile_name+' with contact_information offset '+offset);
    return knex.first()
              .from('ContactInformation')
              .offset(offset)
              .then(function(contact_info) {
                return knex('Profiles')
                          .insert({ID: offset + 1, Name: profile_name, ImageURI: image_url, ContactInformationID: contact_info.ID});
              })
  }

  // Deletes ALL existing entries
  return knex('Profiles').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      create_profile(0, 'Artist 1', '/img/test-data/profile-t.png', null),
      create_profile(1, 'Artist 2', '/img/test-data/art-5.png', null),
      create_profile(2, 'Artist 3', '/img/test-data/art-4.png', null),
      create_profile(3, 'Artist 4', '/img/test-data/art-3.png', null),
      create_profile(4, 'Artist 5', '/img/test-data/art-6.png', null),
      create_profile(5, 'Gallery 1', '/img/test-data/thumb-1.png', null),
      create_profile(6, 'Gallery 2', '/img/test-data/thumb-2.png', null),
      create_profile(7, 'Gallery 3', '/img/test-data/thumb-7.png', null),
      create_profile(8, 'Gallery 4', '/img/test-data/thumb-4.png', null)
    );
  });
};
