exports.seed = function(knex, Promise) {
	// ActivCanvas App API access
	return Promise.join(
		// Inserts seed entries
		knex('GroupEndpoints').insert({ GroupID: 3, EndpointID: 3 })
	);
};