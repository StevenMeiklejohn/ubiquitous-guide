
exports.up = function(knex, Promise) {

	//
	// Create PermissionArtworkActions Table
	//
	return knex.schema.hasTable('PermissionArtworkActions')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PermissionArtworkActions', function (t) {
					t.increments('ID').primary();
					t.integer('ParentActionID');
					t.string('Action', 100).notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE PermissionArtworkActions CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Create PermissionArtwork Table
		//
		.then(function () {
			return knex.schema.hasTable('PermissionArtwork')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PermissionArtwork', function (t) {
					t.increments('ID').primary();
					t.integer('UserID');
					t.integer('ProfileID');
					t.integer('GroupID');
					t.integer('ActionID').notNullable();
					t.integer('TargetArtworkID').notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE PermissionArtwork CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Create PermissionProfileActions Table
		//
		.then(function () {
			return knex.schema.hasTable('PermissionProfileActions')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PermissionProfileActions', function (t) {
					t.increments('ID').primary();
					t.integer('ParentActionID');
					t.string('Action', 100).notNullable();
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE PermissionProfileActions CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})


		//
		// Create PermissionProfile Table
		//
		.then(function () {
			return knex.schema.hasTable('PermissionProfile')
		})
		.then(function (exists) {
			if (!exists) {
				return knex.schema.createTable('PermissionProfile', function (t) {
					t.increments('ID').primary();
					t.integer('UserID');
					t.integer('ProfileID');
					t.integer('GroupID');
					t.integer('ActionID').notNullable();
					t.integer('TargetProfileID');
					t.timestamps();
				})
				.then(function () {
					return knex.raw(
						'ALTER TABLE PermissionProfile CHANGE COLUMN `created_at` created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, ' +
						'CHANGE COLUMN `updated_at` updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE NOW()'
					)
				});
			}
		})





		//
		// Insert artwork permission actions
		//
		.then(function () {
			return knex('PermissionArtworkActions').insert([
				{ Action: 'update' },
				{ Action: 'remove' }
			])
		})

		//
		// Insert profile permission actions (root)
		//
		.then(function () {
			return knex('PermissionProfileActions').insert([
				{ Action: 'all' }
			])
		})

		//
		// Insert profile permission actions (root + 1)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'analytics.all', ParentActionID: parentAction.ID },
				{ Action: 'artwork.all', ParentActionID: parentAction.ID },
				{ Action: 'biography.all', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.all', ParentActionID: parentAction.ID },
				{ Action: 'notification.all', ParentActionID: parentAction.ID },
				{ Action: 'profile.all', ParentActionID: parentAction.ID },
				{ Action: 'registration.all', ParentActionID: parentAction.ID },
				{ Action: 'shortlist.all', ParentActionID: parentAction.ID },
				{ Action: 'subscription.all', ParentActionID: parentAction.ID },
				{ Action: 'video.all', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (artwork specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'artwork.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'artwork.add', ParentActionID: parentAction.ID },
				{ Action: 'artwork.remove', ParentActionID: parentAction.ID },
				{ Action: 'artwork.update', ParentActionID: parentAction.ID }
			])
		})




		//
		// Insert profile permission actions (video specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'video.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'video.add', ParentActionID: parentAction.ID },
				{ Action: 'video.remove', ParentActionID: parentAction.ID },
				{ Action: 'video.update', ParentActionID: parentAction.ID }
			])
		})



		//
		// Insert profile permission actions (dashboard specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'dashboard.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'dashboard.artwork.all', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.customers.all', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.profile.all', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.social.all', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.notifications', ParentActionID: parentAction.ID }
			])
		})



		//
		// Insert profile permission actions (dashboard artwork specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'dashboard.artwork.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'dashboard.artwork.likes', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.artwork.scans', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.artwork.shortlisted', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.artwork.total', ParentActionID: parentAction.ID },
				{ Action: 'dashboard.artwork.views', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (dashboard profile specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'dashboard.profile.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'dashboard.profile.views', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (dashboard customer specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'dashboard.customers.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'dashboard.customers.activity', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (dashboard social specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'dashboard.social.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'dashboard.social.followers', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (shortlist specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'shortlist.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'shortlist.create', ParentActionID: parentAction.ID },
				{ Action: 'shortlist.remove', ParentActionID: parentAction.ID },
				{ Action: 'shortlist.update', ParentActionID: parentAction.ID },
				{ Action: 'shortlist.view', ParentActionID: parentAction.ID },
				{ Action: 'shortlist.item.all', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (shortlist item specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'shortlist.item.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'shortlist.item.add', ParentActionID: parentAction.ID },
				{ Action: 'shortlist.item.remove', ParentActionID: parentAction.ID }
				//{ Action: 'shortlist.item.update', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (notification specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'notification.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'notification.send', ParentActionID: parentAction.ID },
				{ Action: 'notification.view', ParentActionID: parentAction.ID },
				{ Action: 'notification.remove', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (subscription specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'subscription.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'subscription.list', ParentActionID: parentAction.ID },
				{ Action: 'subscription.create', ParentActionID: parentAction.ID },
				{ Action: 'subscription.cancel', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (biography specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'biography.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'biography.update', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (profile info specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'profile.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'profile.update.all', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (analytics specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'analytics.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'analytics.users.all', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (analytics - user specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'analytics.users.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'analytics.users.activity.all', ParentActionID: parentAction.ID }
			])
		})



		//
		// Insert profile permission actions (analytics - user activity specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'analytics.users.activity.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'analytics.users.activity.summary', ParentActionID: parentAction.ID },
				{ Action: 'analytics.users.activity.details', ParentActionID: parentAction.ID }
			])
		})


		//
		// Insert profile permission actions (profile update specific)
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'profile.update.all' }).first('ID');
		})
		.then(function (parentAction) {
			return knex('PermissionProfileActions').insert([
				{ Action: 'profile.update.base', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.consumer', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.contact', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.gallery', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.awards', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.artist', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.social', ParentActionID: parentAction.ID },
				{ Action: 'profile.update.activcanvas', ParentActionID: parentAction.ID }
			])
		})



		//
		// Breeze Gallery Permissions
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'all' }).first('ID');
		})
		.then(function (action) {
			return knex('PermissionProfile').where({ ProfileID: 4732, TargetProfileID: 4648 }).first()
				.then(function (exists) {
					if (!exists) {
						return knex('PermissionProfile').insert([
							{ ActionID: action.ID, ProfileID: 4732, TargetProfileID: 4648 },
							{ ActionID: action.ID, ProfileID: 4732, TargetProfileID: 4649 },
							{ ActionID: action.ID, ProfileID: 4732, TargetProfileID: 4650 },
							{ ActionID: action.ID, ProfileID: 4732, TargetProfileID: 4651 },
							{ ActionID: action.ID, ProfileID: 4732, TargetProfileID: 4652 },
							{ ActionID: action.ID, ProfileID: 4732, TargetProfileID: 4653 }
						])
					}
				})
		})



		//
		// Castle Gallery Permissions
		//
		.then(function () {
			return knex('PermissionProfileActions').where({ Action: 'all' }).first('ID');
		})
		.then(function (action) {
			return knex('PermissionProfile').where({ ProfileID: 4893, TargetProfileID: 4819 }).first()
				.then(function (exists) {
					if (!exists) {
						return knex('PermissionProfile').insert([
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4819 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4820 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4871 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4872 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4873 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4874 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4875 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4876 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4877 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4880 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4881 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4882 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4884 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4885 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4886 },
							{ ActionID: action.ID, ProfileID: 4893, TargetProfileID: 4887 }
						])
					}
				})
		})







		//
		// Add NoVideo column to ArtworkVideos table
		//
		.then(function() {
			return knex.schema.hasColumn('ArtworkVideos', 'NoVideo')
		})
		.then(function(exists) {
			if (!exists) {
				return knex.schema.table('ArtworkVideos', function (t) {
					t.bool('NoVideo').notNullable().defaultTo(0);
				})
			}
		})



		//
		// Add Country to ContactInfo table
		//
		.then(function() {
			return knex.schema.hasColumn('ContactInformation', 'Country')
		})
		.then(function(exists) {
			if (!exists) {
				return knex.schema.table('ContactInformation', function (t) {
					t.string('Country', 100);
				})
			}
		})





		//
		// Add Used field to RefreshTokens table
		//
		.then(function() {
			return knex.schema.hasColumn('RefreshTokens', 'Used')
		})
		.then(function(exists) {
			if (!exists) {
				return knex.schema.table('RefreshTokens', function (t) {
					t.datetime('Used');
				})
			}
		})




		//
		// Make VideoID optional on ArtworkVideos table
		//
		.then(function() {
			return knex.raw('ALTER TABLE ArtworkVideos CHANGE COLUMN VideoID VideoID INT(11) NULL')
		})



		//
		// User artists own images to fill in missing profile images
		//
		.then(function() {
			return knex.raw(
				'update Profiles p ' +
				'LEFT JOIN ' +
				'(SELECT aw.*, COUNT(aw.ID) AS total FROM ' +
				'( ' +
					'SELECT aw.ID, aw.ArtistProfileID, aw.Name, aw.ImageURI ' +
					'FROM Artworks as aw ' +
					'WHERE aw.Deleted = 0 ' +
					'AND aw.ImageURI <> \'\' ' +
					'AND aw.ImageHeight > 0 AND aw.ImageWidth > 0 ' +
					'order by (aw.Views + aw.Likes) desc ' +
				') as aw GROUP BY aw.ArtistProfileID) as aw ' +
				'ON p.ID = aw.ArtistProfileID ' +
				'set p.ImageURI = aw.ImageURI ' +
				'where aw.ID is not null ' +
				'and (p.ImageURI = \'\' or p.ImageURI like \'%placeholder%\') ' +
				'and aw.ImageURI is not null '
			)
		})


		.then(function() {
			return knex('AffiliateCodes').insert([{ Code: 'ARTBNBFOUNDER', Discount: 34 }]);
		})


};

exports.down = function(knex, Promise) {

	//
	// Drop PermissionArtworkActions Table
	//
	return knex.schema.hasTable('PermissionArtworkActions')
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PermissionArtworkActions');
			}
		})


		//
		// Drop PermissionArtwork Table
		//
		.then(function () {
			return knex.schema.hasTable('PermissionArtwork')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PermissionArtwork');
			}
		})


		//
		// Drop PermissionProfileActions Table
		//
		.then(function () {
			return knex.schema.hasTable('PermissionProfileActions')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PermissionProfileActions');
			}
		})


		//
		// Drop PermissionProfile Table
		//
		.then(function () {
			return knex.schema.hasTable('PermissionProfile')
		})
		.then(function (exists) {
			if (exists) {
				return knex.schema.dropTable('PermissionProfile');
			}
		})


		.then(function() {
			return knex('AffiliateCodes').where('Code', 'ARTBNBFOUNDER').del();
		})

};
