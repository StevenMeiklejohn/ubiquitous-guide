
exports.up = function(knex, Promise) {

	//
	// Create PermissionArtworkActions Table
	//
	return knex.schema.hasTable('EmailTemplates')
	  .then(function (exists) {
		  if (!exists) {
			  return knex.schema.createTable('EmailTemplates', function (t) {
					t.increments('ID').primary();
					t.integer('ProfileID');
					t.string('Name', 100).notNullable();
					t.text('HTML').notNullable();
					t.text('CSS').notNullable().defaultTo('');
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
					  'ALTER TABLE EmailTemplates CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
					  'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
		  }
	  })



	  .then(function () {
		  return knex('EmailTemplates').where('Name', 'ARN').first()
	  })
	  .then(function (exists) {
		  if (!exists) {
			  return knex('EmailTemplates').insert([
				  {
					  Name: 'ARN',
					  HTML:
						'<div class="header" style="background:#141d26;padding: 10px;">' +
							'<span class="logo">' +
								'<a href="http://www.artretailnetwork.com">' +
									'<img alt="Art Retail Network" src="https://members.artretailnetwork.com/img/logo-new-40-t.png">' +
								'</a>' +
							'</span>' +
						'</div>' +
					  	'<div class="content" style="padding: 10px;">[BODY]</div>' +
						'<div class="footer" style="padding: 10px;">' +
							'<div><strong>Art Retail Network Ltd.</strong></div>' +
							'<div>The Whisky Bond, Glasgow, UK</div>' +
							'<div><a href="http://www.artretailnetwork.com">www.artretailnetwork.com</a></div>' +
				  		'</div>',
					  CSS:
						'.header {' +
							'background: #141d26;' +
					  		'color: #fff;' +
			  				'padding: 10px;' +
						'}' +
						'.content, .footer {' +
							'padding: 10px;' +
						'}'
				  }
			  ])
		  }
	  })





	  .then(function () {
		  return knex('EmailTemplates').where('Name', 'Breeze Gallery Glasgow').first()
	  })
	  .then(function (exists) {
		  if (!exists) {
			  return knex('EmailTemplates').insert([
				  {
					  Name: 'Breeze Gallery Glasgow',
					  ProfileID: 4732,
					  HTML:
						  '<div class="header" style="padding: 10px 0;">' +
							  '<span class="logo">' +
								  '<a href="http://www.breeze-gallery.co.uk">' +
									'<img alt="Breeze Gallery" src="http://www.breeze-gallery.co.uk/images/logo.jpg">' +
								  '</a>' +
							  '</span>' +
						  '</div>' +
						  '<div class="content" style="padding: 10px 0;">[BODY]</div>' +
						  '<div class="footer" style="padding: 10px 0;">' +
							  '<div><strong>Breeze Gallery Glasgow</strong></div>' +
							  '<div>141 Ingram Street, Merchant City, Glasgow G1 1DW</div>' +
						  	  '<div>Tel: 0141 221 0189</div>' +
							  '<div><a href="http://www.breeze-gallery.co.uk">www.breeze-gallery.co.uk</a></div>' +
						  '</div>',
					  CSS:
						  '.header, .content, .footer {' +
								'padding: 10px 0;' +
						  '}'
				  }
			  ])
		  }
	  })
};

exports.down = function(knex, Promise) {

	//
	// Drop PermissionArtworkActions Table
	//
	return knex.schema.hasTable('EmailTemplates')
	  .then(function (exists) {
		  if (exists) {
			  return knex.schema.dropTable('EmailTemplates');
		  }
	  })


};
