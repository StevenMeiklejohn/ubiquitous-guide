var router = require('express').Router(),
	AccessToken = require('../../auth/access-token');





router

	.get('/:profileID', function (req, res) {
		var sql = 's.ID, s.Name FROM Materials s';
		if (req.params.profileID) {
			sql +=
				' JOIN ArtworkMaterials as awm on s.ID = awm.MaterialID' +
				' JOIN Artworks aw on aw.ID = awm.ArtworkID ' +
				' WHERE aw.ArtistProfileID = ' + req.params.profileID + ' AND aw.Deleted = 0' +
				' ORDER BY Name';
		}

		db.distinct(db.raw(sql))
			.then(function (data) {
				return res.json(data)
			})

	})



	// list all materials
	.get('/', function (req, res) {
		db.select('ID', 'Name', 'Description').from('Materials').where('Deleted', false)
		.then(function (data) {
			return res.json(data)
		})
	})






	// add material
	.post('/add', function (req, res) {

		var name = req.body.Name,
			description = req.body.Description

		// check arguments
		if(!name || !description){

			// missing data
			return res.status(400).json({ 'Message': 'Please supply a material name and description' })

		}

		// check for existing material
		db('Materials').count('ID as total').where({ Name: name })
		.then(function(data){
			if(data[0].total){

				// material already exists
				return res.status(400).json({ 'Message': 'A material already exists with that name: ' + name })

			}

			// insert new material
			return db('Materials').insert({
				Name: name,
				Description: description,
				Deleted: 0
			})
		})
		.then(function(material){

			// success
			return res.status(201).json({ 'ID': material[0], 'Message': 'Success' })

		})
		.catch(function(err){

			// error
			return res.status(500).json({ 'Message': 'Material NOT created' })

		})

	}) // add material





	// update material
	.put('/:materialID/update', function (req, res) {

		AccessToken.getUser(req).then(function (user){

			if(!user) return res.status(500).json({ 'Message': 'Current user could not be determined' })
			if(!user.memberOf('Administrators')) res.status(403).json({ 'Message': 'You do not have permission to update this item' })

			var materialID = parseInt(req.params.materialID),
				name = req.body.Name,
				description = req.body.Description

			// check arguments
			if(isNaN(materialID)){

				// invalid material ID
				return res.status(400).json({ 'Message': 'Invalid material ID: ' + req.params.materialID })

			}
			else if(!name || !description){

				// missing data
				return res.status(400).json({ 'Message': 'Please supply a material name and description' })

			}

			// check for existing material
			db('Materials').count('ID as total').where({ ID: materialID })
			.then(function(data){
				if(!data[0].total){

					// material doesn't exist
					return res.status(404).json({ 'Message': 'Not Found' })

				}

				// update material
				return db('Materials').where({ ID: materialID }).update({
					Name: name,
					Description: description,
				})
			})
			.then(function(material){

				// success
				return res.json({ 'Message': 'Success' })

			})
			.catch(function(err){

				// error  
				if(!res.headersSent) return res.status(500).json({ 'Message': 'Material NOT updated' })

			})

		}) // current user

	}) // update material





	// remove material
	.delete('/:materialID/remove', function (req, res) {

		AccessToken.getUser(req).then(function (user){

			if(!user) return res.status(500).json({ 'Message': 'Current user could not be determined' })
			if(!user.memberOf('Administrators')) res.status(403).json({ 'Message': 'You do not have permission to remove this item' })

			var materialID = parseInt(req.params.materialID)

			if(isNaN(materialID)){

				// invalid material ID
				return res.status(400).json({ 'Message': 'Invalid material id: ' + req.params.materialID })

			}

			// check for existing material
			db('Materials').count('ID as total').where({ ID: materialID })
			.then(function(data){
				if(!data[0].total){

					// material doesn't exist
					return res.status(404).json({ 'Message': 'Not Found' })

				}

				// flag material as deleted
				return db('Materials').where({ ID: materialID }).update({ Deleted: 1 })
			})
			.then(function(material){

				// success
				return res.status(204).send()

			})
			.catch(function(err){

				// error  
				if(!res.headersSent) return res.status(500).json({ 'Message': 'Material NOT removed' })

			})

		}) // current user

	})





module.exports = router
