var router = require('express').Router();
var Promise = require('promise')





// check for a valid user ID
function checkUserID(userID){
	return new Promise(function(resolve, reject){
		userID = parseInt(userID)
		if(isNaN(userID)) return reject( new Error('Invalid user ID') )

		db('Users').count('ID as total').where({ ID: userID })
		.then(function(data){
			return resolve(data ? data[0].total > 0 : false)
		})
	})
}





// check for a valid group ID
function checkGroupID(groupID, callback){
	return new Promise(function(resolve, reject){
		groupID = parseInt(groupID)
		if(isNaN(groupID)) return reject( new Error('Invalid group ID') )

		db('Groups').count('ID as total').where({ ID: groupID })
		.then(function(data){
			return resolve(data ? data[0].total > 0 : false)
		})
	})
}





router





	// search all users
	.post('/search', function (req, res) {

		var filters = req.body.Filters,
			pagination = req.body.Pagination;

		pagination.PageSize = pagination.PageSize || 10;
		pagination.PageSize = pagination.PageSize > 100 ? 100 : pagination.PageSize < 1 ? 1 : pagination.PageSize;

		// construct base sql query
		var sql =
			'from Users u ' +
			'left join Artists a on a.UserID = u.ID ' +
			'left join GalleryUsers gu on gu.UserID = u.ID ' +
			'left join Galleries ga on ga.ID = gu.GalleryID ';
		
		// append filters to query
		var filterCount = Object.keys(filters).length, output = 0;
		if (filterCount) {
			if (filters.Groups !== undefined) {
				sql +=
						'left join UserGroups ug on u.ID = ug.UserID '  +
						'left join Groups g on g.ID = ug.GroupID ';
			}

			sql += 'where';

			if (filters.IsDeleted !== undefined) {
				sql += ' u.Deleted = ' + (filters.IsDeleted ? '1' : '0');
				output++;
			}
			if (filters.IsAuthorised !== undefined) {
				sql += (output > 0 ? ' and' : '') + ' u.Authorised = ' + (filters.IsAuthorised ? '1' : '0');
				output++;
			}
			if (filters.IsArtist !== undefined) {
				sql += (output > 0 ? ' and' : '') + ' a.ID is' + (filters.IsArtist ? ' not' : '') + ' null';
				output++;
			}
			if (filters.IsGallery !== undefined) {
				sql += (output > 0 ? ' and' : '') + ' ga.ID is' + (filters.IsGallery ? ' not' : '') + ' null';
				output++;
			}
			if (filters.Email !== undefined) {
				sql += (output > 0 ? ' and' : '') + ' u.Email like \'%' + filters.Email + '%\'';
				output++;
			}
			if (filters.Groups !== undefined) {
				sql += (output > 0 ? ' and' : '') + ' g.ID in (' + filters.Groups.join(',') + ')';
				output++;
			}
		}

		// FIXME - We need API-level specified ordering
		sql += ' order by Email';

		// execute query
		db.first(db.raw(
			'count(distinct u.ID) as Results ' + sql
		))
		.then(function (total) {

			db.select(db.raw(
				'u.ID,' +
				'u.created_at as CreatedAt,' +
				'u.updated_at as UpdatedAt,' +
				'u.Email,' +
				'u.Authorised,' +
				'u.Deleted,' +
				'coalesce(a.ProfileID, ga.ProfileID) AS ProfileID ' +
				sql
			))
			.offset(pagination.PageSize * pagination.PageNumber)
			.limit(pagination.PageSize)
			.then(function (data) {

				var rowsLeft = data.length;

				for (var i in data) {
					db.select(db.raw(
						'g.ID, g.Name from Groups as g ' +
						'join UserGroups as ug on g.ID = ug.GroupID ' +
						'and ug.UserID = ' + data[i].ID
					)).then(function(groups) {
						data[i].Groups = groups;
						rowsLeft--;

						if (rowsLeft < 1) {
							pagination.TotalResults = total.Results;

							res.json({
								Data: data,
								Pagination: pagination
							});
						}
					})
				}
			})
			.catch(function () {
				console.log(arguments);

				res.json({});
			});

		});

	})





	// create a new user
	.post('/add', function(req, res){
		// using plain text password to test

		// check for existing user
		db('Users').count('ID as total').where({ Email: req.body.email })
		.then(function(data){
			if(data[0].total){

				// user already exists
				res.status(400)
				return res.json({ 'Error': 'A user already exists with that email: ' + req.body.email })

			}

			if(!req.body.email || !req.body.password){

				// missing data
				res.status(400)
				return res.json({ 'Error': 'Please supply both email and password' })

			}

			// insert new record
			return db('Users').insert({
				Email: req.body.email,
				Password: req.body.password,
				Authorised: 1,
				Deleted: 0
			})
		})
		.then(function(user){

			// success
			res.status(201)
			res.json({ 'UserID': user[0] })

		})
		.catch(function(err){

			// error
			res.status(500)
			res.json({ 'Error': 'User NOT created' })

		})

	}) // add endpoint





	// fetch single user details
	.get('/:userID', function(req, res){

		var userData, userID = parseInt(req.params.userID)
		if(isNaN(userID)){

			// invalid user ID
			res.status(400)
			return res.json({ 'Error': 'Invalid user id: ' + req.params.userID })

		}

		db.first('u.*', 'g.ProfileID as GalleryProfileID', 'a.ProfileID as ArtistProfileID').from('Users as u')
			.leftJoin('GalleryUsers as gu', 'u.ID', 'gu.UserID')
			.leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
			.leftJoin('Artists as a', 'u.ID', 'a.UserID')
			.where( 'u.ID', '=', userID )
		.then(function(data){

			if(!(userData = data)){

				res.status(404)
				return res.json({ 'Message': 'User not found: ' + req.params.userID })

			}

			return db.select('ug.GroupID', 'g.Name')
			.from('UserGroups as ug')
			.leftJoin('Groups as g', 'ug.GroupID', 'g.ID')
			.where( 'ug.UserID', '=', data.ID )

		})
		.then(function(groups){

			// tidy up the response with a single profile ID and current groups
			userData.ProfileID = userData.GalleryProfileID || userData.ArtistProfileID
			delete userData.GalleryProfileID
			delete userData.ArtistProfileID
			userData.Groups = groups
			return res.json( userData )

		})
		.catch(function(err){

			res.status(500)
			res.json({ 'Error': 'Could not fetch user data' })

		})

	})





	// add user to group
	.post('/:userID/groups/add', function(req, res){

		var userID = parseInt(req.params.userID)
		var groupID = parseInt(req.body.groupID)

		if(isNaN(userID)){

			// invalid user ID
			res.status(400)
			return res.json({ 'Message': 'Not a valid UserID: ' + req.params.userID })

		}
		else if(isNaN(groupID)){

			// invalid group ID
			res.status(400)
			return res.json({ 'Message': 'Not a valid GroupID: ' + req.body.groupID })

		}

		checkUserID(userID)
		.then(function(userExists){

			if (!userExists) {

				res.status(404)
				return res.json({ 'Message': 'User not found: ' + userID })

			}

			return checkGroupID(groupID)

		})
		.then(function(groupExists){

			if (!groupExists) {

				res.status(404)
				res.json({ 'Message': 'Group not found: ' + groupID })

			}

			// member, user and group checks all pass
			return db('UserGroups').insert({ UserID: userID, GroupID: groupID })

		})
		.then(function (data) {

			// success
			res.status(201)
			res.json({ 'Message': 'Success' })

		})
		.catch(function (err) {

			// error
			res.status(500)
			res.json({ 'Error': 'User not added to group' })

		})

	}) // add user to group





	// remove user from group
	.post('/:userID/groups/remove', function(req, res){

		var userID = parseInt(req.params.userID)
		var groupID = parseInt(req.body.groupID)

		if(isNaN(userID)){

			// invalid user ID
			res.status(400)
			return res.json({ 'Error': 'Invalid user id: ' + req.params.userID })

		}
		else if(isNaN(groupID)){

			// invalid group ID
			res.status(400)
			return res.json({ 'Error': 'Invalid group id: ' + req.body.groupID })

		}

		checkUserID(userID)
		.then(function(userExists){

			if (!userExists) {

				res.status(404)
				return res.json({ 'Message': 'User not found: ' + userID })

			}

			return checkGroupID(groupID)

		})
		.then(function(groupExists){

			// member. user and group checks all pass
			return db('UserGroups').where({ UserID: userID, GroupID: groupID }).del()

		})
		.then(function(data){

			// success
			res.json({ 'Message': 'Success' })

		})
		.catch(function (err) {

			// error
			res.status(500)
			res.json({ 'Error': 'User not removed from group' })

		})

	}) // remove user from group





	// authorize user
	.put('/:userID/enable', function(req, res){
		var userID = parseInt(req.params.userID)

		if(isNaN(userID)){

			// invalid user ID
			res.status(400)
			return res.json({ 'Error': 'Invalid user id: ' + req.params.userID })

		}

		checkUserID(userID)
		.then(function(userExists){
			if (!userExists) {

				res.status(404)
				return res.json({ 'Message': 'User not found: ' + userID })

			}

			// group member and userID checks passed
			return db('Users').where({ ID: userID }).update({ Authorised: 1 })
		})
		.then(function(data){

			res.json({ 'Message': 'Success' })

		})
		.catch(function(err){

			res.status(500)
			res.json({ 'Error': 'User NOT authorised' })

		})

	}) // authorise user





	// de-authorize user
	.put('/:userID/disable', function(req, res){
		var userID = parseInt(req.params.userID)

		if(isNaN(userID)){

			// invalid user ID
			res.status(400)
			return res.json({ 'Error': 'Invalid user id: ' + req.params.userID })

		}

		checkUserID(userID)				  
		.then(function(userExists){
			if (!userExists) {  
								
				res.status(404)
				return res.json({ 'Message': 'User not found: ' + userID })
							
			}

			// group member and userID checks passed
			return db('Users').where({ ID: userID }).update({ Authorised: 0 })
		})
		.then(function(data){

			res.json({ 'Message': 'Success' })

		})
		.catch(function(err){

			res.status(500)
			res.json({ 'Error': 'User NOT authorised' })

		})

	}) // de-authorise user





	// remove user (soft delete)
	.delete('/:userID/remove', function(req, res){
		var userID = parseInt(req.params.userID)

		if(isNaN(userID)){

			// invalid user ID
			res.status(400)
			return res.json({ 'Error': 'Invalid user id: ' + req.params.userID })

		}

		checkUserID(userID)
		.then(function(userExists){
			if (!userExists) {

				res.status(404)
				return res.json({ 'Message': 'User not found: ' + userID })

			}

			// group member and userID checks passed
			return db('Users').where({ ID: userID }).update({ Deleted: 1 })
		})
		.then(function(data){

			res.json({ 'Message': 'Success' })

		})
		.catch(function(err){

			res.status(500)
			res.json({ 'Error': 'User NOT removed' })

		})

	}) // remove user





module.exports = router
