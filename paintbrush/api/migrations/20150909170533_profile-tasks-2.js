
exports.up = function(knex, Promise) {

	//
	// Update complete profile group
	//

	return knex('TaskGroups').where({ Key: 'complete-profile' }).update({ Gallery: true, Description: '<p>Please complete your profile</p>' })

	//
	// Allow individual tasks to be assigned to specific types of profiles
	//

	.then(function () {
		return knex.schema.hasColumn('Tasks', 'Artist')
	})
	.then(function (exists) {
		if (!exists) {
			return knex.schema.table('Tasks', function (t) {
				t.boolean('Artist').notNullable().defaultTo(false);
			})
		}
	})
	.then(function () {
		return knex.schema.hasColumn('Tasks', 'Gallery')
	})
	.then(function (exists) {
		if (!exists) {
			return knex.schema.table('Tasks', function (t) {
				t.boolean('Gallery').notNullable().defaultTo(false);
			})
		}
	})
	.then(function () {
		return knex.schema.hasColumn('Tasks', 'Consumer')
	})
	.then(function (exists) {
		if (!exists) {
			return knex.schema.table('Tasks', function (t) {
				t.boolean('Consumer').notNullable().defaultTo(false);
			})
		}
	})

	//
	// Update existing tasks
	//

	.then(function () {
		return knex('Tasks').where({ Key: 'profile-image' }).update({ Artist: true, Gallery: true });
	})
	.then(function () {
		return knex('Tasks').where({ Key: 'first-artwork' }).update({ Artist: true });
	})
	.then(function () {
		return knex('Tasks').where({ Key: 'artist-details' }).update({ Artist: true });
	})
	.then(function () {
		return knex('Tasks').where({ Key: 'biography-min' }).update({ Artist: true, Gallery: true });
	});

};

exports.down = function (knex, Promise) {

	//
	// Undo task group updates
	//

	return knex('TaskGroups').where({ Key: 'complete-profile' }).update({ Gallery: false })

	//
	//	Remove additional columns from Tasks table
	//

	.then(function () {
		return knex.schema.hasColumn('Tasks', 'Artist');
	})
	.then(function (exists) {
		if (exists) {
			return knex.schema.table('Tasks', function (t) {
				t.dropColumn('Artist');
			})
		}
	})
	.then(function () {
		return knex.schema.hasColumn('Tasks', 'Gallery');
	})
	.then(function (exists) {
		if (exists) {
			return knex.schema.table('Tasks', function (t) {
				t.dropColumn('Gallery');
			})
		}
	})
	.then(function () {
		return knex.schema.hasColumn('Tasks', 'Consumer');
	})
	.then(function (exists) {
		if (exists) {
			return knex.schema.table('Tasks', function (t) {
				t.dropColumn('Consumer');
			})
		}
	});

};
