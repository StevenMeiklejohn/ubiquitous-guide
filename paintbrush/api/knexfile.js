//
// Database connection settings
//
module.exports = {

	development: {
		client: 'mysql',
		connection: {
			host: 'localhost',
			user: 'root',
			database: 'paintbrush_production'
		},
		migrations: {
			directory: './migrations'
		}
	},

	test: {
		client: 'mysql',
		connection: {
			host: 'localhost',
			user: process.env.MYSQL_USER || 'root',
			password: process.env.MYSQL_PASSWORD,
			database: 'test'
		},
		migrations: {
			directory: './migrations'
		}
	},

	staging: {
		client: 'mysql',
		connection: {
			host: process.env.MYSQL_HOST,
			database: 'paintbrush_staging',
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD
		},
		pool: {
			min: 2,
			max: 10
		},
		migrations: {
			directory: './migrations',
			tableName: 'knex_migrations'
		}
	},

	production: {
		client: 'mysql',
		connection: {
			host: process.env.MYSQL_HOST,
			database: 'paintbrush_production',
			user: process.env.MYSQL_USER,
			password: process.env.MYSQL_PASSWORD
		},
		migrations: {
			directory: './migrations',
			tableName: 'knex_migrations'
		}
	}

};