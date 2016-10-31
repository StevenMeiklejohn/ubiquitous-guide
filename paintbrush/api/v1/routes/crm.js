var config = require('../config'),
	router = require('express').Router(),
	sugar = require('node-sugarcrm-client');


router


	// check IP address of all CRM push requests
	.all('/push/*', function (req, res, next) {
		if(!config.crm.ip.test(req.ip)) return res.status(403).json({ Message: 'This request must come directly from CRM' })
		return next()
	})


	// CRM push : update account
	.post('/push/account/update', function (req, res) {
		return res.status(501).json({ Message: 'Not Implemented' })
	})


	// CRM push : delete account
	.delete('/push/account/delete', function (req, res) {
		return res.status(501).json({ Message: 'Not Implemented' })
	})


	// CRM push : update contact
	.post('/push/contact/update', function (req, res) {
		var bean = req.body.Bean || {}
		var beanID = bean.id || false
		if(!beanID) return res.status(400).json({ Message: 'Bean must be a Sugar bean object' })

		db
		.first('u.ID as UserID', db.raw('COALESCE(a.ProfileID, g.ProfileID) as ProfileID'), 'p.ContactInformationID')
		.from('Users as u')
		.leftJoin('Artists as a', 'u.ID', 'a.UserID')
		.leftJoin('GalleryUsers as gu', 'u.ID', 'gu.UserID')
		.leftJoin('Galleries as g', 'g.ID', 'gu.GalleryID')
		.leftJoin('Profiles as p', 'p.ID', db.raw('COALESCE(a.ProfileID, g.ProfileID)'))
		.where({ 'p.CRMContactID': beanID })
		.asCallback(function(err, result){
			if(err) return res.status(500).json({ Message: 'Error fetching Contact Information' })
			if(!result) return res.status(404).json({ Message: 'Contact Information Not Found' })
			var userID = result.UserID
			var profileID = result.ProfileID
			var contactID = result.ContactInformationID
		
			db('Users')
			.where({ ID: userID })
			.update({
				Email: bean.email1
			})
			.asCallback(function(err, result){
				if(err) return res.status(500).json({ Message: 'Error Updating User Information' })
				if(!result) return res.status(404).json({ Message: 'User Not Found' })

				db('Profiles')
				.where({ ID: profileID })
				.update({
					Name: ((bean.first_name || '') + ' ' + (bean.last_name || '')).trim()
				})
				.asCallback(function(err, result){
					if(err) return res.status(500).json({ Message: 'Error Updating Profile Information' })
					if(!result) return res.status(404).json({ Message: 'Profile Not Found' })

					var address = (bean.primary_address_street || '').split('\n')
					db('ContactInformation')
					.where({ ID: contactID })
					.update({ 
						Address1: (address[0] || '').trim(),
						Address2: (address[1] || '').trim(),
						Address3: (address[2] || '').trim(),
						Town: bean.primary_address_city || '',
						Postcode: bean.primary_address_postalcode || '',
						Landline: bean.phone_work || bean.phone_home || bean.phone_other || '',
						Mobile: bean.phone_mobile || ''
					})
					.asCallback(function (err, result){
						if(err) return res.status(500).json({ Message: 'Error Updating Contact Information' })
						if(!result) return res.status(404).json({ Message: 'Contact Information Not Found' })
						return res.json({ Message: 'Success' })
					})
				})
			})
		})
	})


	// CRM push : delete contact
	.delete('/push/contact/delete', function (req, res) {
		var bean = req.body.Bean || {}
		var beanID = bean.id || false
		if(!beanID) return res.status(400).json({ Message: 'Bean must be a Sugar bean object' })

		db
		.first('u.ID as UserID', db.raw('COALESCE(a.ProfileID, g.ProfileID) as ProfileID'), 'p.ContactInformationID')
		.from('Users as u')
		.leftJoin('Artists as a', 'u.ID', 'a.UserID')
		.leftJoin('GalleryUsers as gu', 'u.ID', 'gu.UserID')
		.leftJoin('Galleries as g', 'g.ID', 'gu.GalleryID')
		.leftJoin('Profiles as p', 'p.ID', db.raw('COALESCE(a.ProfileID, g.ProfileID)'))
		.where({ 'p.CRMContactID': beanID })
		.asCallback(function(err, result){
			if(err) return res.status(500).json({ Message: 'Error fetching Contact Information' })
			if(!result) return res.status(404).json({ Message: 'Contact Information Not Found' })
			var userID = result.UserID
			var profileID = result.ProfileID
			var contactID = result.ContactInformationID
		
			db('Users')
			.where({ ID: userID })
			.update({
				Deleted: 1
			})
			.asCallback(function(err, result){
				if(err) return res.status(500).json({ Message: 'Error Deleting User' })
				if(!result) return res.status(404).json({ Message: 'User Not Found' })

				db('Profiles')
				.where({ ID: profileID })
				.update({
					Deleted: 1
				})
				.asCallback(function(err, result){
					if(err) return res.status(500).json({ Message: 'Error Deleting Profile' })
					if(!result) return res.status(404).json({ Message: 'Profile Not Found' })

					db('ContactInformation')
					.where({ ID: contactID })
					.update({ 
						Deleted: 1
					})
					.asCallback(function (err, result){
						if(err) return res.status(500).json({ Message: 'Error Deleting Contact Information' })
						if(!result) return res.status(404).json({ Message: 'Contact Information Not Found' })
						return res.json({ Message: 'Success' })
					})
				})
			})
		})
	})


	// create or update a CRM contact
	.put('/contact/update/:profileID', function (req, res){
		sugar.init({ apiURL: config.crm.api, login: config.crm.user, passwd:  config.crm.pass })
		sugar.login(function(sessionID){
			if(!sessionID) return res.status(401).json({ Message: 'Can\'t log in to CRM - please check user credentials' })

			var profileID = req.params.profileID

			// fetch the profile details
			db
			.first(
				'u.ID as UserID', 'u.Email', db.raw('COALESCE(a.ProfileID, g.ProfileID) as ProfileID'),
				'a.profileID as ArtistProfileID', 'g.ProfileID as GalleryProfileID',
				'p.Name', 'p.ContactInformationID', 'p.CRMContactID',
				'p.ActivCanvasStatusID',
				'ci.Address1', 'ci.Address2', 'ci.Address3', 'ci.Town', 'ci.Postcode',
				'ci.Website', 'ci.Landline', 'ci.Mobile'
			)
			.from('Users as u')
			.leftJoin('Artists as a', 'u.ID', 'a.UserID')
			.leftJoin('GalleryUsers as gu', 'u.ID', 'gu.UserID')
			.leftJoin('Galleries as g', 'g.ID', 'gu.GalleryID')
			.leftJoin('Profiles as p', 'p.ID', db.raw('COALESCE(a.ProfileID, g.ProfileID)'))
			.leftJoin('ContactInformation as ci', 'ci.ID', 'p.ContactInformationID')
			.where({ 'p.ID': profileID })
			.asCallback(function(err, result){
				if(err) return res.status(500).json({ Message: 'Error fetching Profile Information' })
				if(!result) return res.status(404).json({ Message: 'Profile Information Not Found' })

				var userType = result.ArtistProfileID ? 1 : 0;

				// prepare the data for sugar
				var names = result.Name.split(' ')
				var params = {
                 	session:  sessionID,
                	module_name : "Contacts",
                	name_value_list : [
                		{ name: 'email1', value: result.Email },
                    	{ name: 'first_name', value: names[0] },
                    	{ name: 'last_name', value: names[names.length - 1] },
                    	{ name: 'primary_address_street', value: [result.Address1, result.Address2, result.Address3].join('\n') },
                    	{ name: 'primary_address_city', value: result.Town },
                    	{ name: 'primary_address_postalcode', value: result.Postcode },
                    	{ name: 'phone_work', value: result.Landline },
                    	{ name: 'phone_mobile', value: result.Mobile },
                    	{ name: 'user_type_c', value: userType },
                    	{ name: 'arn_status_c', value: result.ActivCanvasStatusID === 3 ? 'Master' : 'Free' }
                	]
             	}

             	// include the existing id to update a sugar record - else a new record will be created
             	if(result.CRMContactID) params.name_value_list.push({ name: 'id', value: result.CRMContactID })
			    
			    // update sugar via API
			    sugar.call("set_entry", params, function(crmResult ,err){
			        if(err) return res.status(500).json(err)
					if(!crmResult) return res.status(500).json({ Message: 'Error sending data to CRM' })

					// if this is a new CRM record, record the id in the profile
					if(!result.CRMContactID){
						console.log('Update CRMContactID')
						db('Profiles').where({ ID: profileID }).update({ CRMContactID: crmResult.id })
						.then(function () {
							res.json({ Message: 'Success' })
						})
						.catch(function () {
							res.status(500).json({ Message: 'Error updating profile with CRM ID' })
						})
					}
					else{
						return res.json({ Message: 'Success' })
					}
			    })
			})
		})
	}) // create / update CRM contact


	// create lead for ActivCanvas request
	.put('/activcanvas/request/:profileID', function (req, res){
		sugar.init({ apiURL: config.crm.api, login: config.crm.user, passwd:  config.crm.pass })
		sugar.login(function(sessionID){
			if(!sessionID) return res.status(401).json({ Message: 'Can\'t log in to CRM - please check user credentials' })

			var profileID = req.params.profileID

			// fetch the profile details
			db
			.first(
				'u.ID as UserID', 'u.Email', db.raw('COALESCE(a.ProfileID, g.ProfileID) as ProfileID'),
				'a.profileID as ArtistProfileID', 'g.ProfileID as GalleryProfileID',
				'p.Name','p.ContactInformationID', 'p.CRMContactID',
				'ci.Address1', 'ci.Address2', 'ci.Address3', 'ci.Town', 'ci.Postcode',
				'ci.Website', 'ci.Landline', 'ci.Mobile'
			)
			.from('Users as u')
			.leftJoin('Artists as a', 'u.ID', 'a.UserID')
			.leftJoin('GalleryUsers as gu', 'u.ID', 'gu.UserID')
			.leftJoin('Galleries as g', 'g.ID', 'gu.GalleryID')
			.leftJoin('Profiles as p', 'p.ID', db.raw('COALESCE(a.ProfileID, g.ProfileID)'))
			.leftJoin('ContactInformation as ci', 'ci.ID', 'p.ContactInformationID')
			.where({ 'p.ID': profileID })
			.asCallback(function(err, result){
				console.log(result)
				if(err) return res.status(500).json({ Message: 'Error fetching Profile Information' })
				if(!result) return res.status(404).json({ Message: 'Profile Information Not Found' })

				var userType = result.ArtistProfileID ? 1 : 0;

				// prepare the data for sugar - don't include any id as a new record should be created
				var names = result.Name.split(' ')
				var params = {
                 	session:  sessionID,
                	module_name : "Leads",
                	name_value_list : [
                		{ name: 'email1', value: result.Email },
                    	{ name: 'first_name', value: names[0] },
                    	{ name: 'last_name', value: names[names.length - 1] },
                    	{ name: 'primary_address_street', value: [result.Address1, result.Address2, result.Address3].join('\n') },
                    	{ name: 'primary_address_city', value: result.Town },
                    	{ name: 'primary_address_postalcode', value: result.Postcode },
                    	{ name: 'phone_work', value: result.Landline },
                    	{ name: 'phone_mobile', value: result.Mobile },
                    	{ name: 'description', value: 'ActivCanvas Request' },
                    	{ name: 'user_type_c', value: userType }
                	]
             	}

			    // update sugar via API
			    sugar.call("set_entry", params, function(crmResult ,err){
			        console.log(crmResult)
			        if(err) return res.status(500).json(err)
					if(!crmResult) return res.status(500).json({ Message: 'Error sending data to CRM' })

					// don't record lead id - only contacts are to sync
					return res.json({ Message: 'Success' })
			    })
			})
		})
	}) // ActivCanvas lead


module.exports = router