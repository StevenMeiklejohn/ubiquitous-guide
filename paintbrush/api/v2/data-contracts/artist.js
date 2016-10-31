var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token'),
	Permission = require('../lib/permission'),
	service = require('../services/artist'),
	is = require('../lib/validate').is;


module.exports = {

	list: {

		ageBrackets: function() {
			return new Promise(function(resolve) {
				service.list.ageBrackets()
					.then(function(brackets) {
						resolve({ status: 200, body: brackets });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching artist age brackets');
					})
			});
		},


		types: function() {
			return new Promise(function(resolve) {
				service.list.types()
					.then(function(types) {
						resolve({ status: 200, body: types });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching artist types');
					})
			});
		},


		workSpaces: function() {
			return new Promise(function(resolve) {
				service.list.workSpaces()
					.then(function(spaces) {
						resolve({ status: 200, body: spaces });
					})
					.catch(function (err) {
						processError(err, req, resolve, 'Error occurred while fetching artist working spaces');
					})
			});
		}

	},



	search: function(req) {
		return new Promise(function(resolve) {

			var filters = req.body.Filters || {},
				pagination = req.body.Pagination || {},
				sort = req.body.Sort || {};

			if (pagination.PageSize === undefined) {
				pagination.PageSize = 10;
			}
			if (pagination.PageNumber === undefined) {
				pagination.PageNumber = 0;
			}

			//
			// check data types
			//
			if (pagination.PageNumber !== undefined && !is.int(pagination.PageNumber, 0)) {
				resolve({ status: 400, body: { Message: 'PageNumber must be an integer greater than or equal to 0'} });
			}
			else if (pagination.PageSize !== undefined && !is.int(pagination.PageSize, 1, 100)) {
				resolve({ status: 400, body: { Message: 'PageSize must be an integer within the range 1-100'} });
			}
			else if (sort.Field !== undefined && typeof sort.Field !== 'string') {
				resolve({ status: 400, body: { Message: 'Sort field must be a string'} });
			}
			else if (sort.Direction !== undefined && (typeof sort.Direction !== 'string' || ['asc', 'desc'].indexOf(sort.Direction.toLowerCase()) < 0)) {
				resolve({ status: 400, body: { Message: 'Sort direction must be a string with a value of \'asc\' or \'desc\'' } });
			}

			//
			// Otherwise perform search query
			//
			else {
				AccessToken.getUser(req).then(function (user) {

					var run = function() {
						service.search(user.ProfileID, filters, pagination, sort)
							.then(function(results) {
								resolve({ status: 200, body: results });
							})
							.catch(function (err) {
								processError(err, req, resolve, 'Error occurred while fetching artists');
							});
					};


					//
					// If searching the current profiles own artists grab the list of artist profile ID's to pass to service
					//
					if (filters.MyArtists) {
						Permission.Profile.list('all', user.UserID).then(function(profiles) {
							filters.MyArtists = profiles;
							run();
						})
					}
					else {
						run();
					}


				})

			}

		})
	}


};