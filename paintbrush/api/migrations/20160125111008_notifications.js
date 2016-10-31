
exports.up = function(knex) {

	return knex.schema.hasColumn('Notifications', 'MessageID')
		.then(function (exists) {
			if (!exists) {
				return knex.schema.table('Notifications', function (t) {
					t.integer('MessageID');
				})
				.then(function(){
					return knex.raw(
						'ALTER TABLE Messages ' +
						'CHANGE COLUMN `MessageThreadID` `MessageThreadID` INT(11) NULL,' +
						'CHANGE COLUMN `PreviousMessageID` `PreviousMessageID` INT(11) NULL;');
				})
			}
		})



			.then(function(){
				return knex.raw('ALTER TABLE ActivCanvasQueue CHANGE COLUMN VideoID VideoID INT(11) NULL;');
			})


};

exports.down = function(knex, Promise) {
	return knex.schema.hasColumn('Notifications', 'MessageID')
		.then(function (exists) {
			if (exists) {
				return knex.schema.table('Notifications', function (t) {
					t.dropColumn('MessageID');
				})
			}
		});
};
