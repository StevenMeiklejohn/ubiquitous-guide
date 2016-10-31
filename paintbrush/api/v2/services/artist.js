var Promise = require('bluebird'),
	config = require('../config');

module.exports = {


	list: {

		ageBrackets: function() {
			return new Promise(function(resolve, reject) {
				db('AgeBrackets')
					.select('ID', 'Description')
					.orderBy('Description')
					.then(resolve)
					.catch(reject);
			});
		},


		types: function() {
			return new Promise(function(resolve, reject) {
				db('ArtistTypes')
					.select('ID', 'Type', 'Description')
					.orderBy('Type')
					.then(resolve)
					.catch(reject);
			});
		},


		workSpaces: function() {
			return new Promise(function(resolve, reject) {
				db('WorkingSpaces')
					.select('ID', 'Description')
					.orderBy('Description')
					.then(resolve)
					.catch(reject);
			});
		}

	},
	
	
	
	search: function (currentProfileID, filters, pagination, sort) {
		return new Promise(function(resolve, reject) {

			var sql =
				'FROM Artists AS a ' +
				'JOIN Profiles AS p ON a.ProfileID = p.ID ' +
				'WHERE a.Deleted = 0 AND p.Deleted = 0 ',
				sortSql = '';


			if (Array.isArray(filters.MyArtists)) {
				sql += 'AND a.ProfileID in (' + filters.MyArtists.join(',') + ') ';
			}
			else {
				sql += 'AND a.Private = 0 ';
			}

			if (filters.Name) {
				sql += 'AND p.Name LIKE \'%' + filters.Name + '%\'';
			}

			var direction = (sort.Direction || '').toLowerCase() === 'asc' ? 'ASC': 'DESC';

			// sort order
			switch (sort.Field) {
				case 'Artworks':
					sortSql += 'Artworks ' + direction;
					break;
				case 'ProfileGeneral':
					sortSql += 'ProfileGeneral ' + direction;
					break;
				case 'ProfileArtist':
					sortSql += 'ProfileArtist ' + direction;
					break;
				case 'ProfileBiography':
					sortSql += 'ProfileBiography ' + direction;
					break;
				case 'ProfileSocialMedia':
					sortSql += 'ProfileSocialMedia ' + direction;
					break;
				case 'Videos':
					sortSql += 'Videos ' + direction;
					break;
				default:
					sortSql += 'Name ' + direction;
					break;
			}
			sortSql += ', Name ASC ';


			// execute query
			db.first(db.raw(
				'COUNT(DISTINCT a.ID) AS results ' + sql
			))
			.then(function (total) {
				return db.select(db.raw(
					'pr.*, ' +
					'(SELECT COUNT(ID) FROM Artworks aw WHERE aw.ArtistProfileID = pr.ID AND aw.Deleted = 0) as Artworks, ' +
					'(SELECT COUNT(ID) FROM Videos v WHERE v.ProfileID = pr.ID AND v.Deleted = 0) as Videos, ' +
					'(' +
						'(SELECT IF(pr.Name = \'\', 0, 1)) + (SELECT IF(pr.ImageURI = \'\', 0, 1))' +
					') AS ProfileGeneral, ' +
					'(' +
						'(SELECT IF((SELECT (SELECT COUNT(ID) FROM ArtistTypeMap am WHERE am.ArtistID = pr.ArtistID) > 0), 1, 0)) + ' +
						'(SELECT IF((SELECT (SELECT COUNT(ID) FROM ArtistWorkingSpaces aws WHERE aws.ArtistID = pr.ArtistID) > 0), 1, 0))' +
					') as ProfileArtist, ' +
					'(' +
						'(SELECT COUNT(ID) FROM Biographies WHERE ProfileID = pr.ID AND Description IS NOT NULL AND Description <> \'\')' +
					') AS ProfileBiography, ' +

					'(' +
						'(SELECT COUNT(ID) FROM SocialMediaProfiles WHERE ProfileID = pr.ID)' +
					') AS ProfileSocialMedia ' +

					'FROM (SELECT ' +
						'p.ID,' +
						'a.ID as ArtistID,' +
						'p.Name,' +
						'p.ImageURI ' +
						sql +
					') as pr ' +
					' ORDER BY ' + sortSql
				))
				.offset(pagination.PageSize * pagination.PageNumber)
				.limit(pagination.PageSize)
				.then(function (data) {
					pagination.TotalResults = total.results;

					data.forEach(function (item) {
						item.ImageURI = item.ImageURI || config.profile.defaultImage;
					});

					resolve({
						Data: data,
						Pagination: pagination
					})

				})
			})
			.catch(reject);


		});
	}

	
};