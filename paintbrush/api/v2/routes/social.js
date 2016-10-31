var reqP = require('request-promise'),
	router = require('express').Router(),
	AccessToken = require('../../auth/access-token'),
	Promise = require('promise');


router

		//
		// Lists currently defined social services
		//
		.get('/services', function(req, res) {

			db('SocialMediaServices').select(
				'ID',
				'Name',
				'URL',
				'ImageURI'
			)
			.then(function(services) {
				res.json(services);
			})
			.catch(function() {
				res.status(500).json({ Message: 'An unexpected error occurred' });
			})

		})


		// list all followers
		.get('/:profileID/followers', function (req, res) {
			var profileID = parseInt(req.params.profileID)
			if (isNaN(profileID)) return res.status(400).json({ Message: 'Invalid Profile ID' })

			AccessToken.getUser(req).then(function (user) {

				if (user === null) {
					return res.status(500).json({ Message: 'Current user could not be determined' })
				}

				if (user.ProfileID != profileID && !user.memberOf('Administrators')) {
					return res.status(403).json({ Message: 'You do not have permission to query this profile' })
				}

				db
					.select(
						'p.ID as ProfileID', 'p.Name', 'p.ImageURI'
					)
					.from('Followers as f')
					.innerJoin('Profiles as p', 'f.ProfileID', 'p.ID')
					.where('f.FollowingProfileID', profileID)
					.then(function (data) {
						return res.json(data)
					})
					.catch(function () {
						console.log(arguments)
						return res.status(500).json({ Message: 'Error listing followers' })
					})

			})

		})


		// list all profiles being followed
		.get('/:profileID/following', function (req, res) {
			var profileID = parseInt(req.params.profileID)
			if (isNaN(profileID)) return res.status(400).json({ Message: 'Invalid Profile ID' })

			AccessToken.getUser(req).then(function (user) {

				if (user === null) {
					return res.status(500).json({ Message: 'Current user could not be determined' })
				}

				if (user.ProfileID != profileID && !user.memberOf('Administrators')) {
					return res.status(403).json({ Message: 'You do not have permission to query this profile' })
				}

				db
					.select(
						'p.ID as ProfileID', 'p.Name', 'p.ImageURI'
					)
					.from('Followers as f')
					.innerJoin('Profiles as p', 'f.FollowingProfileID', 'p.ID')
					.where('f.ProfileID', profileID)
					.then(function (data) {
						return res.json(data)
					})
					.catch(function () {
						return res.status(500).json({ Message: 'Error listing profiles followed' })
					})

			})

		})


		// social data scrape
		.get('/:profileID/stats', function (req, res) {
			var profileID = parseInt(req.params.profileID)
			if (isNaN(profileID)) return res.status(400).json({ Message: 'Invalid Profile ID' })

			AccessToken.getUser(req).then(function (user) {

				if (user === null) {
					return res.status(500).json({ Message: 'Current user could not be determined' })
				}

				if (user.ProfileID != profileID && !user.memberOf('Administrators')) {
					return res.status(403).json({ Message: 'You do not have permission to query this profile' })
				}

				var socialData = {
					TotalFollowers: 0
				}

				var options = {
					timeout: 10000,
					headers: {
						'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.8; rv:24.0) Gecko/20100101 Firefox/24.0'
					}
				}

				var socialHandles = {}

				db('ProfileSocialMedia as psm')
				.leftJoin('SocialMedia as sm', 'psm.SocialMediaID', 'sm.ID')
				.select('sm.Name', 'psm.URL')
				.where({ 'psm.ProfileID': profileID })
				.then( function (data){
					if(data){
						for(i = 0; i < data.length; i++){
							socialHandles[data[i].Name] = data[i].URL
						}
					}
					if(socialHandles.Twitter) return reqP(socialHandles.Twitter, options)
				})
				.catch( function (err){
					return Promise.resolve(true)
				})
				.then( function (response){
					if(socialHandles.Twitter){
						socialData.Twitter = '?'
						//var regex = /([,0-9]+) Tweets(.|[\r\n])+?([,0-9]+) Following(.|[\r\n])+?([,0-9]+) Followers(.|[\r\n])+?([,0-9]+) Favourites/g
						var regex = /([,0-9]+) Followers/g
						var scrape = regex.exec(response) || []
						if(scrape.length){
							var followers = parseInt(scrape[1].replace(',', ''))
							socialData.Twitter = followers
							socialData.TotalFollowers += followers
						}
					}
					if(socialHandles.Facebook) return reqP(socialHandles.Facebook, options)
				})
				.catch( function (err){
					return Promise.resolve(true)
				})
				.then( function (response){
					if(socialHandles.Facebook){
						socialData.Facebook = '?'
						var regex = /([,0-9]+) likes/g
						var scrape = regex.exec(response) || []
						if(scrape.length){
							var followers = parseInt(scrape[1].replace(',', ''))
							socialData.Facebook = followers
							socialData.TotalFollowers += followers
						}
					}
					if(socialHandles.Instagram) return reqP(socialHandles.Instagram, options)
				})
				.catch( function (err){
					return Promise.resolve(true)
				})
				.then( function (response){
					if(socialHandles.Instagram){
						socialData.Instagram = '?'
						var regex = /\"followed_by\":\{\"count\":([,0-9]+)\}/g
						var scrape = regex.exec(response) || []
						if(scrape.length){
							var followers = parseInt(scrape[1].replace(',', ''))
							socialData.Instagram = followers
							socialData.TotalFollowers += followers
						}
					}
					if(socialHandles.Pinterest) return reqP(socialHandles.Pinterest, options)
				})
				.catch( function (err){
					return Promise.resolve(true)
				})
				.then( function (response){
					if(socialHandles.Pinterest){
						socialData.Pinterest = '?'
						var regex = /([,0-9]+) followers/g
						var scrape = regex.exec(response) || []
						if(scrape.length){
							var followers = parseInt(scrape[1].replace(',', ''))
							socialData.Pinterest = followers
							socialData.TotalFollowers += followers
						}
					}
					if(socialHandles.GooglePlus) return reqP(socialHandles.GooglePlus, options)
				})
				.catch( function (err){
					return Promise.resolve(true)
				})
				.then( function (response){
					if(socialHandles.GooglePlus){
						socialData.googleplus = '?'
						var regex = /([,0-9]+)<\/span> followers/g
						var scrape = regex.exec(response) || []
						if(scrape.length){
							var followers = parseInt(scrape[1].replace(',', ''))
							socialData.googleplus = followers
							socialData.totalFollowers += followers
						}
					}
				})
				.then( function (){
					return res.json(socialData)
				})
				.catch( function (err){
					console.log(err.message)
					if(!res.headersSent) return res.status(500).json({ 'Message': 'Error fetching social stats' })
				})

			})
		})


module.exports = router;
