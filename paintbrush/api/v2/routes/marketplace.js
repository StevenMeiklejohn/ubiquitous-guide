var config = require('../config'),
	router = require('express').Router(),
	Permission = require('../lib/permission'),
	AccessToken = require('../../auth/access-token'),
	SqlString = require('knex/lib/query/string');



router


	// recommended artists for current user - currently the top 10 shortlisted
	.get('/recommended', function (req, res) {

		// check current user
		AccessToken.getUser(req).then(function (user) {

			if(!user) return res.status(500).json({ Message: 'Current user could not be determined' })

			var sql =
				'SELECT a.ID AS ArtistID, p.ID AS ProfileID, p.Name, p.ImageURI as ProfileImageURI, ' +
				'aw.ID AS ArtworkID, aw.Name AS ArtworkTitle, aw.ImageURI, aw.total AS TotalArtwork, ' +
				// total views and likes for ALL artwork by the artist
				'(SELECT COUNT(ID) FROM ArtworkViews WHERE ArtworkID IN (SELECT ID FROM Artworks WHERE ArtistProfileID = p.ID)) AS TotalViews, ' +
				'(SELECT COUNT(ID) FROM ArtworkLikes WHERE ArtworkID IN (SELECT ID FROM Artworks WHERE ArtistProfileID = p.ID)) AS TotalLikes, ' +
				'COUNT(sla.ArtistID) AS TotalShortlisted ' +
				'FROM Artists a, Shortlists sl, ShortlistArtists sla, Profiles p ' + 
				'LEFT JOIN ' +
					'(SELECT MAX(ID) AS ID, ArtistProfileID, MAX(Name) AS Name, MAX(ImageURI) AS ImageURI, ' +
					'COUNT(ID) AS total ' +
					'FROM Artworks WHERE Deleted = 0 ' +
					'GROUP BY ArtistProfileID) AS aw ' +
				'ON p.ID = aw.ArtistProfileID ' +
				'WHERE a.ID = sla.ArtistID AND sla.ShortlistID = sl.ID AND sl.TypeID = 1 ' + 
				'AND a.ProfileID = p.ID ' +
				'AND a.Deleted = 0 ' +
				'ORDER BY TotalShortlisted DESC LIMIT 0,10'
			
			db.raw(sql)
			.then(function (recommended){

				res.json(recommended[0])

			})
			.catch(function (err){

				res.status(500).json({ 'Message': 'Error fetching recommended artists' })

			})

		})

	}) // recommended artists





	// search artists
	.post('/search', function (req, res, next) {

		var pagination = req.body.Pagination || {},
			filters = req.body.Filters || {},
			pageSize = Math.min( Math.max( 1, parseInt(pagination.PageSize) || 10 ), 100 ),
			pageNum = parseInt(pagination.PageNumber) || 0,
			// send pagination data back with results
			pagination = { PageSize: pageSize, PageNumber: pageNum };

		// build SQL with filters
		// currently sub selects the most recent artwork by each artist matching criteria
		var sql = '',
			joins = '',
			artworkSql = '',
			artworkWhere = 'WHERE aw.Deleted = 0 AND aw.ImageURI <> \'\' AND aw.ImageHeight > 0 AND aw.ImageWidth > 0 ',
			where = 'WHERE a.Deleted = 0',
			sort = '';
	
		// text initially searching only on artist name
		if (filters.Text) {
			where += ' AND (p.Name LIKE ' + SqlString.escape('%' + filters.Text + '%') + ')';
		}


		
		if (filters.Style) {
			if (!Array.isArray(filters.Style)) return res.status(400).json({ 'Message': 'Style filter: an array of styles is required' });
			artworkSql += 'JOIN ArtworkStyles AS awSty ON aw.ID = awSty.ArtworkID ';
			var styles = filters.Style.filter(function (i) { return !isNaN(parseInt(i)) });
			artworkWhere += ' AND awSty.StyleID IN (' + styles.join() + ')';
		}
		
		if (filters.Price) {
			if (!Array.isArray(filters.Price)) return res.status(400).json({ 'Message': 'Price filter: an array of price bands is required' });
			var pricebands = filters.Price.filter(function (i) { return !isNaN(parseInt(i)) });
			artworkWhere += ' AND PricebandID IN (' + pricebands.join() + ')';
		}

		if (filters.Type) {
			if (!Array.isArray(filters.Type)) return res.status(400).json({ 'Message': 'Type filter: an array of types is required' });
			var types = filters.Type.filter(function (i) { return !isNaN(parseInt(i)) });
			artworkWhere += ' AND ArtworkTypeID IN (' + types.join() + ')';
		}

		if (filters.Material) {
			if (!Array.isArray(filters.Material)) return res.status(400).json({ 'Message': 'Material filter: an array of materials is required' });
			artworkSql += 'JOIN ArtworkMaterials as awMat ON aw.ID = awMat.ArtworkID ';
			var materials = filters.Material.filter(function (i) { return !isNaN(parseInt(i)) });
			artworkWhere += ' AND awMat.MaterialID IN (' + materials.join() + ')'
		}

		if (filters.Subject) {
			if (!Array.isArray(filters.Subject)) return res.status(400).json({ 'Message': 'Subject filter: an array of subjects is required' });
			artworkSql += 'JOIN ArtworkSubjects as awSub ON aw.ID = awSub.ArtworkID ';
			var subjects = filters.Subject.filter(function (i) { return !isNaN(parseInt(i)) });
			artworkWhere += ' AND awSub.SubjectID IN (' + subjects.join() + ')'
		}

		if (filters.Colour) {
			if (!Array.isArray(filters.Colour)) return res.status(400).json({ 'Message': 'Colour filter: an array of colours is required' });
			var colours = filters.Colour.filter(function (item) {
				return Object.prototype.toString.call(item).slice(8, -1) == "Object" && !isNaN(parseInt(item.R)) && !isNaN(parseInt(item.G)) && !isNaN(parseInt(item.B))
			});
			var len;
			if (len = colours.length) {
				var range = 30;
				artworkSql += 'JOIN ArtworkColours as awCol ON aw.ID = awCol.ArtworkID ';
				artworkWhere += ' AND(';
				for (i = 0; i < len; i++) {
					if (i) artworkWhere += ' OR ';
					artworkWhere +=
						'(' + 
						'awCol.R BETWEEN ' + Math.max(0, colours[i].R - range) + ' AND ' + Math.min(255, colours[i].R + range) + ' AND ' +
						'awCol.G BETWEEN ' + Math.max(0, colours[i].G - range) + ' AND ' + Math.min(255, colours[i].G + range) + ' AND ' +
						'awCol.B BETWEEN ' + Math.max(0, colours[i].B - range) + ' AND ' + Math.min(255, colours[i].B + range) +
						')'
				}
				artworkWhere += ')'
			}
		}

		// exclude artists with no artwork
		where += ' AND aw.ID IS NOT NULL';



		var runQuery = function() {

			sql =
				'FROM Artists a ' +
				'LEFT JOIN Profiles p ON a.profileID = p.ID ' +
				joins +
				'LEFT JOIN ' +
					'(SELECT aw.*, COUNT(aw.ID) AS total FROM ' +
						'(SELECT aw.ID, aw.ArtistProfileID, aw.Name, aw.ImageURI, aw.ArtworkTypeID, aw.created_at, aw.PricebandID, aw.ImageWidth, aw.ImageHeight ' +
						'FROM Artworks as aw ' + artworkSql + ' ' + artworkWhere + ' ORDER BY aw.created_at desc ' +
					') as aw GROUP BY aw.ArtistProfileID) as aw ' +
				'ON p.ID = aw.ArtistProfileID ' + where;

			// set query sort parameters
			if (req.body.Sort) {

				switch (req.body.Sort.Field) {
					case 'Popular': sort = ' order by (Views + Likes) desc'; break;
					case 'Latest': sort = ' order by aw.created_at desc'; break;
					case 'Views': sort = ' order by Views desc'; break;
					case 'Likes': sort = ' order by Likes desc'; break;
					case 'Artworks': sort = ' order by Artworks desc'; break;
				}

			}

			// execute query
			db.first(db.raw(

				// total results
				'COUNT(DISTINCT a.ID) AS results ' + sql

			))
			.then(function (total) {

				db.select(db.raw(
					'a.ID AS ArtistID, ' +
					'p.ID AS ProfileID, ' +
					'p.Name AS ArtistName, ' +
					'p.ImageURI AS ProfileImageURI, ' +
					'aw.ID AS ArtworkID, ' +
					'aw.Name AS ArtworkTitle, ' +
					'aw.ImageURI, ' +
					'aw.ImageWidth, ' +
					'aw.ImageHeight, ' +
					'aw.total AS Artworks, ' +
					// total views and likes for ALL artwork by the artist
					'(SELECT COUNT(ID) FROM Artworks WHERE ArtistProfileID = p.ID AND Deleted = 0) AS TotalArtworks, ' +
					'(SELECT SUM(Views) FROM Artworks WHERE ArtistProfileID = p.ID AND Deleted = 0) AS Views, ' +
					'(SELECT SUM(Likes) FROM Artworks WHERE ArtistProfileID = p.ID AND Deleted = 0) AS Likes ' +
					sql + sort
				))
				.offset(pageSize * pageNum)
				.limit(pageSize)
				.then(function (data) {
					data = data || [];

					var loaded = 0,
						complete = function () {
							loaded++;
							if (loaded >= data.length) {
								pagination.TotalResults = total.results;
								res.json({
									Data: data,
									Pagination: pagination
								})
							}
						};


					data.forEach(function (aw) {

						if (!aw.ProfileImageURI) {
							aw.ProfileImageURI = config.profile.defaultImage;
						}
						aw.Types = [];

						db.select('Type')
						.from('ArtistTypes as at')
						.join('ArtistTypeMap as atm', 'at.ID', 'atm.ArtistTypeID')
						.where({ 'atm.ArtistID': aw.ArtistID })
						.then(function (_types) {
							for (var i in _types) { aw.Types.push(_types[i].Type); }
						})
						.finally(complete);

					});

					if (!data.length) {
						complete();
					}

				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred while contacting the database' });
					});
				})

			})
			.catch(function (err) {
				logError(err, req, function () {
					res.status(500).json({ Message: 'Unexpected error occurred while contacting the database' });
				});
			});

		};


		if (filters.GalleryProfileID) {
			AccessToken.getUser(req).then(function (user) {
				return Permission.Profile.list('all', user.UserID).then(function(profiles) {

					// ensure these are all artist profiles
					return db('Artists').whereRaw('ProfileID IN (' + profiles.join(',') + ')').select('ProfileID')
						.then(function (artistProfiles) {
							var _ids = artistProfiles.map(function (ap) { return ap.ProfileID; });
							if (_ids.length) {
								where += ' AND a.ProfileID IN (' + _ids.join(',') +')';
							}
							else {
								where += ' AND a.ProfileID = -10';
							}
							runQuery();
						})
				})
				.catch(function (err) {
					logError(err, req, function () {
						res.status(500).json({ Message: 'Unexpected error occurred while contacting the database' });
					});
				});
			});
		}
		else {
			where += ' AND a.Private = 0';
			runQuery();
		}

	}) // search artists





	// popular artwork by artist
	.get('/popular/:artistID/:pageSize?/:pageNumber?', function (req, res) {

		var artistID = parseInt(req.params.artistID),
			pageSize = parseInt(req.params.pageSize || 10),
			pageNum = parseInt(req.params.pageNumber || 0),
			// send pagination data back with results
			pagination = { PageSize: pageSize, PageNumber: pageNum }

		if (!artistID) {

			res.status(400).json({ 'Message': 'Invalid artist id' })

		}
		else{

			var sql =
				'FROM Artists a ' +
				'LEFT JOIN Profiles p ON a.profileID = p.ID ' +
				'LEFT JOIN Artworks aw ON p.ID = aw.ArtistProfileID ' +
				'WHERE a.ID = ' + SqlString.escape(artistID) + ' ' +
				'AND a.Deleted = 0 '

			db.first(db.raw(

				// total results
				'COUNT(aw.ID) AS results ' + sql

			))
			.then(function (total) {

				dbNest(
					db.select(db.raw(
						'aw.ID AS _ArtworkID, ' +
						'aw.Name AS _ArtworkTitle, ' +
						'aw.ImageURI AS _ArtworkURI, ' +
						'(SELECT COUNT(ID) FROM ArtworkViews WHERE ArtworkID = aw.ID) AS _TotalViews, ' +
						'(SELECT COUNT(ID) FROM ArtworkLikes WHERE ArtworkID = aw.ID) AS _TotalLikes ' +
						sql +
						// using likes as the primary sort for popularity
						'ORDER BY _TotalLikes DESC, _TotalViews DESC'
					))
					.offset(pageSize * pageNum)
					.limit(pageSize)
				)
				.then(function (data) {

					// success
					pagination.TotalResults = total.results
					res.json({
						Data: data,
						Pagination: pagination
					})

				})
				.catch(function (err) {

					// error fetching results
					res.status(500).json({ 'Error': 'Querying popular artwork' })

				})

			})
			.catch(function () {

				// error querying total
				res.status(500).json({ 'Error': 'Querying popular artwork total' })

			})

		}

	}) // popular artwork by artist





module.exports = router
