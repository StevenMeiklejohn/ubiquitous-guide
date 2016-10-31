exports.seed = function(knex, Promise) {
	return knex('Endpoints').del().then(function() {
		return Promise.join(
			// admin
			knex('Endpoints').insert({ ID: 1, Pattern: '^.*', Description: 'Everything' }),
			// registered users
			knex('Endpoints').insert({ ID: 2, Pattern: '^(profile|artist|artwork|biography|question|social|materials|workspaces|video|marketplace|shortlist|connections|notifications|dashboard)($|\\/.*$)', Description: 'Registered User Access only' }),
			// ActivCanvas
			knex('Endpoints').insert({ ID: 3, Pattern: '^(artist|artwork)\/.*$', Description: 'ActivCanvas artist and artwork access' })
		);
	});
};
