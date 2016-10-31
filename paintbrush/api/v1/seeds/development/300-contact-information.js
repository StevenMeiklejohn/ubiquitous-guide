
exports.seed = function(knex, Promise) {

  function create_contact_info(address1, address2, town, postcode, website, landline, mobile) {
    return knex('ContactInformation')
           .insert({ Address1: address1,
                     Address2: address2,
                     Town: town,
                     Postcode: postcode,
                     Website: website,
                     Landline: landline,
                     Mobile: mobile
                  });
  }

  // Deletes ALL existing entries
  return knex('ContactInformation').del().then(function() {
    return Promise.join(
      // Inserts seed entries
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890'),
      create_contact_info('address1', 'address2', 'town', 'postcode', 'http://www.artretailnetwork.com', '0141 000 111', '071234567890')
    );
  });
};
