var router = require('express').Router();





router





	// list all groups
	.get('/', function (req, res) {
		
		db
		.select('ID', 'Name', 'Description').from('Groups')
		.then(function (data) {
			return res.json(data)
		})
		.catch(function () {
			return res.status(500).json({ Message: 'Error listing groups' })
		});

	})





	// add a new group
	.post('/add', function (req, res) {
	
		var name = req.body.Name,
			description = req.body.Description

		// check arguments
		if(!name || !description){

			// missing data
			return res.status(400).json({ 'Message': 'Please supply a group name and description' })

		}

		// check for existing group
		db('Groups').count('ID as total').where({ Name: name })
		.then(function(data){
			if(data[0].total){

				// group already exists
				return es.status(400).json({ 'Message': 'A group already exists with that name: ' + name })

			}

			// insert new group
			return db('Groups').insert({
				Name: name,
				Description: description,
				Deleted: 0
			})
		})
		.then(function(group){

			// success
			return res.status(201).json({ 'ID': group[0] })

		})
		.catch(function(err){

			// error
			if(!res.headersSent) return res.status(500).json({ 'Message': 'Group NOT created' })

		})

	}) // add group





	// view group details
	.get('/:groupID', function (req, res) {

		var groupID = parseInt(req.params.groupID)
		if(isNaN(groupID)){

			// invalid group ID
			return res.status(400).json({ 'Message': 'Invalid group id: ' + req.params.groupID })

		}

		db.table('Groups').first('Name', 'Description').where({ ID: groupID, Deleted: 0 })
		.then(function(group){

			if(group){

				// success - fetch members
				db.table('Users as u').select('u.ID', 'u.Email')
				.leftJoin('UserGroups as ug', 'u.ID', 'ug.UserID')
				.where('ug.GroupID', '=', groupID)
				.then(function(members){

					// add members to result
					group.Members = members
					return res.json( group )

				})

			}
			else{

				// group doesn't exist
				return res.status(404).json({ 'Message': 'Not Found' })

			}

		})

	}) // view group details





	// update group
	.put('/:groupID/update', function (req, res) {

		var groupID = parseInt(req.params.groupID),
			name = req.body.Name,
			description = req.body.Description

		// check arguments
		if(isNaN(groupID)){
		
			// invalid group ID
			return res.status(400).json({ 'Message': 'Invalid group ID: ' + req.params.groupID })
		
		}
		else if(!name || !description){

			// missing data
			return res.status(400).json({ 'Message': 'Please supply a group name and description' })

		}

		// check for existing group
		db('Groups').count('ID as total').where({ ID: groupID })
		.then(function(data){
			if(!data[0].total){

				// group doesn't exist
				return res.status(404).json({ 'Message': 'Not Found' })

			}

			// update group
			return db('Groups').where({ ID: groupID }).update({
				Name: name,
				Description: description,
			})
		})
		.then(function(group){

			// success
			return res.json({ 'Message': 'Success' })

		})
		.catch(function(err){

			// error  
			if(!res.headersSent) return res.status(500).json({ 'Message': 'Group NOT updated' })

		})

	}) // update group





	// delete group (soft)
	.delete('/:groupID/remove', function (req, res) {

		var groupID = parseInt(req.params.groupID)

		if(isNaN(groupID)){

			// invalid group ID
			return res.status(400).json({ 'Message': 'Invalid group id: ' + req.params.groupID })

		}

		// check for existing group
		db('Groups').count('ID as total').where({ ID: groupID })
		.then(function(data){
			if(!data[0].total){

				// group doesn't exist
				return res.status(404).json({ 'Message': 'Not Found' })

			}

			// flag group as deleted
			return db('Groups').where({ ID: groupID }).update({ Deleted: 1 })
		})
		.then(function(group){

			// success
			return res.status(204).send()
		})
		.catch(function(err){

			// error  
			if(!res.headersSent) return res.status(500).json({ 'Message': 'Group NOT removed' })

		})

	}) // delete group




module.exports = router
