
exports.up = function(knex) {

	//
	// Add scanned tally to Artworks table
	//
	return knex.schema.hasColumn('Artworks', 'Scanned')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Artworks', function (t) {
					t.integer('Scanned').notNullable().defaultTo(0);
				})
			}
		})

		//
		// Rename AnalyticEvents.ProfileID to AnalyticEvents.UserProfileID
		//
		.then(function() {
			return knex.schema.hasColumn('AnalyticEvents', 'UserProfileID')
		})
		.then(function(exists) {
			if (!exists) {
				return knex.raw('ALTER TABLE AnalyticEvents CHANGE COLUMN ProfileID UserProfileID INT(11) NOT NULL')
					.then(function() {
						return knex.schema.table('AnalyticEvents', function (t) {
							t.integer('ProfileID');
						});
					})
			}
		})


		//
		// Add ProfileID to AnalyticEventTypes table
		//
		.then(function() {
			return knex.schema.hasColumn('AnalyticEventTypes', 'ProfileID')
		})
		.then(function(exists) {
			if (!exists) {
				return knex.schema.table('AnalyticEventTypes', function (t) {
					t.boolean('ProfileID').notNullable().defaultTo(0);
				})

				//
				// Define 'Viewed Profile' event type
				//
				.then(function() {
					return knex('AnalyticEventTypes').insert({
						Description: 'Viewed Profile',
						ProfileID: true
					})
				})

			}
		})


		//
		// Script existing artwork views data into analytics table
		//
		.then(function() {
			return knex.raw(
				'INSERT INTO AnalyticEvents(UserID, UserProfileID, ArtworkID, ArtistID, ProfileID, EventID, ClientID, created_at, updated_at) ' +
				'SELECT COALESCE(a.UserID, gu.UserID, c.UserID), av.ViewerProfileID, av.ArtworkID, aa.ID, aa.ProfileID, 7, 1, av.created_at, av.updated_at ' +
				'FROM ArtworkViews av ' +
				'LEFT JOIN Artists as a on av.ViewerProfileID = a.ProfileID ' +
				'LEFT JOIN Consumers as c on av.ViewerProfileID = c.ProfileID ' +
				'LEFT JOIN Galleries as g on av.ViewerProfileID = g.ProfileID ' +
				'LEFT JOIN GalleryUsers as gu on g.ID = gu.GalleryID ' +
				'LEFT JOIN Artworks as aw on av.ArtworkID = aw.ID ' +
				'LEFT JOIN Artists as aa on aw.ArtistProfileID = aa.ProfileID '
			)
		})
		.then(function() {
			return knex('ArtworkViews').del();
		})



		//
		// Script existing profile views data into analytics table
		//
		.then(function() {
			return knex('AnalyticEventTypes').where('Description', 'Viewed Profile').first();
		})
		.then(function(eventType) {
			return knex.raw(
				'INSERT INTO AnalyticEvents(UserID, UserProfileID, ProfileID, EventID, ClientID, created_at, updated_at) ' +
				'SELECT COALESCE(a.UserID, gu.UserID, c.UserID), pv.ViewerProfileID, pv.ProfileID, ' + eventType.ID + ', 1, pv.created_at, pv.updated_at ' +
				'FROM ProfileViews pv ' +
				'LEFT JOIN Artists as a on pv.ViewerProfileID = a.ProfileID ' +
				'LEFT JOIN Consumers as c on pv.ViewerProfileID = c.ProfileID ' +
				'LEFT JOIN Galleries as g on pv.ViewerProfileID = g.ProfileID ' +
				'LEFT JOIN GalleryUsers as gu on g.ID = gu.GalleryID'
			)
		})
		.then(function() {
			return knex('ProfileViews').del();
		})


		//
		// Rename CalleryArtists column
		//
		.then(function() {
			return knex.schema.hasColumn('GalleryArtists', 'ArtistProfileID')
		})
		.then(function(exists) {
			if (!exists) {
				return knex.raw('ALTER TABLE GalleryArtists CHANGE COLUMN ArtistID ArtistProfileID INT(11) NOT NULL;');
			}
		})


};

exports.down = function(knex) {

	return knex.schema.hasColumn('Artworks', 'Scanned')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Artworks', function (t) {
					t.dropColumn('Scanned');
				})
			}
		})


		//
		// Rename AnalyticEvents.UserProfileID to AnalyticEvents.ProfileID
		//
		.then(function() {
			return knex.schema.hasColumn('AnalyticEvents', 'UserProfileID')
		})
		.then(function(exists) {
			if (exists) {
				return knex.schema.table('AnalyticEvents', function (t) {
					t.dropColumn('ProfileID');
				})
				.then(function() {
					return knex.raw('ALTER TABLE AnalyticEvents CHANGE COLUMN UserProfileID ProfileID INT(11) NOT NULL');
				})
			}
		})

};
