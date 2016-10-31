var Promise = require('bluebird'),
	AccessToken = require('../../auth/access-token');


//
// Cached permissions
//
var cache = {
	artwork: {},
	profile: {},
	user: {}
};

//
// Clears the permissions cache
//
var clearCache = function () {
	cache = {
		artwork: {},
		profile: {},
		user: {}
	}
};


//
// Cached actions
//
var cacheActions = {};

//
// Returns the permission action specified if it exists in the database
//
var getAction = function (type, action) {
	return new Promise(function(resolve, reject) {

		if (cacheActions[type] && cacheActions[type][action]) {
			resolve(cacheActions[type][action]);
		}
		else {
			db.first('a.ID', 'p.Action as ParentAction')
				.from('Permission' + type + 'Actions as a')
				.leftJoin('Permission' + type + 'Actions as p', 'a.ParentActionID', 'p.ID')
				.where('a.Action', action)
				.then(function(_action) {
					if (!_action) {
						reject('Permission action ' + type.toLowerCase() + '.' + action + ' not found');
					}
					else {
						cacheActions[type] = cacheActions[type] || {};
						cacheActions[type][action] = _action;
						resolve(_action);
					}
				})
				.catch(reject);
		}
	})
};


//
// Returns the current action ID and any parent action IDs
//
var getActionBranch = function (type, action, list) {
	return new Promise(function(resolve, reject) {
		list = list || [];

		if (!action) {
			resolve(list);
		}
		else {
			getAction(type, action)
				.then(function(a) {
					if (!a) {
						resolve(list);
					}
					else {
						list.push(a.ID);
						return getActionBranch(type, a.ParentAction, list).then(resolve);
					}
				})
				.catch(function(err) {
					reject(err);
				})
		}
	});
};


//
// Returns a list of profile id's that are currently administrators
//
var getAdminProfileIDs = function () {
	return new Promise(function (resolve, reject) {
		db.select('p.ID')
			.from('UserGroups as ug')
			.leftJoin('Artists as a', 'a.UserID', 'ug.UserID')
			.leftJoin('GalleryUsers as gu', 'gu.UserID', 'ug.UserID')
			.leftJoin('Galleries as g', 'gu.GalleryID', 'g.ID')
			.leftJoin('Consumers as c', 'c.UserID', 'ug.UserID')
			.leftJoin('Profiles as p', db.raw('coalesce(a.ProfileID, g.ProfileID, c.ProfileID)'), 'p.ID')
			.whereRaw('ug.GroupID = 2 AND p.ID IS NOT NULL')
			.then(function (profiles) {
				var unique = {};
				profiles.forEach(function (p) {
					unique[p.ID] = 1;
				});
				resolve(Object.keys(unique))
			})
			.catch(reject);
	})
};


//
// This class provides a permission model for artwork, profile and user objects
//
var Permission = {

	clearCache: clearCache,

	getAdminProfileIDs: getAdminProfileIDs,


	//
	// Checks if the specified user can perform a particular action against the target artwork object
	//
	Artwork: function(action, userID, targetArtworkID) {
		return new Promise(function(resolve) {
			var cacheKey = userID + '-' + targetArtworkID + '-' + action;

			if (cache.artwork[cacheKey] !== undefined) {
				resolve(cache.artwork[cacheKey]);
			}
			else {

				db('Artworks').first('ArtistProfileID').where('ID', targetArtworkID)
					.then(function(artwork) {

						//
						// If artwork does not exists return true to allow calling code to return an appropriate response to user (e.g. not found)
						//
						if (!artwork) {
							resolve(true);
						}
						else {

							// get the profile and any groups associated with this user
							return AccessToken.getUserByID(userID)
								.then(function(user) {

									if (!user) {
										resolve(false);
									}
									// return true if this is the users own profile or the current user is an administrator
									else if (user.ProfileID === artwork.ArtistProfileID || user.memberOf('Administrators')) {
										cache.profile[cacheKey] = true;
										resolve(true);
									}
									else {

										// check if artwork level permission defined
										return getAction('Artwork', action)
											.then(function(_action) {

												var groups = [];
												user.Groups.forEach(function(g) {
													groups.push(g.ID);
												});

												var where =
														'ActionID = ' + _action.ID + ' AND TargetArtworkID = ' + targetArtworkID + ' AND ' +
														'(' +
															'UserID = ' + userID + ' OR ProfileID = ' + user.ProfileID + ' OR ' +
															'GroupID IN (' + groups.join(',') + ')' +
														')';

												return db('PermissionArtwork').whereRaw(where).first()
													.then(function(allowed) {
														if (allowed) {
															cache.artwork[cacheKey] = !!allowed;
															resolve(!!allowed);
														}
														else {
															// check if permission has been defined at the profile level instead
															return Permission.Profile.check('artwork.' + action, userID, artwork.ArtistProfileID)
																.then(function(_allowed) {
																	cache.artwork[cacheKey] = _allowed;
																	resolve(_allowed);
																});
														}
													});

											});

									}
								});

						}
					})
					.catch(function(err) {
						console.error(err);
						resolve(false);
					});
			}

		})
	},



	//
	// Handles profile specific permissions
	//
	Profile: {

		//
		// Checks if the specified user profile can perform a particular action against the target profile
		//
		check: function(action, userID, targetProfileID) {
			return new Promise(function (resolve) {
				var cacheKey = 'c-' + userID + '-' + targetProfileID + '-' + action;

				targetProfileID = targetProfileID * 1;
				userID = userID * 1;

				if (cache.profile[cacheKey] !== undefined) {
					resolve(cache.profile[cacheKey]);
				}
				else {

					db('Profiles').first('ID').where('ID', targetProfileID)
						.then(function (profile) {

							//
							// If profile does not exists return true to allow calling code to return an appropriate response to user (e.g. not found)
							//
							if (!profile) {
								resolve(true);
							}
							else {

								// get the profile and any groups associated with this user
								return AccessToken.getUserByID(userID)
									.then(function (user) {

										if (!user) {
											resolve(false);
										}
										// return true if this is the users own profile or user is admin
										else if (user.ProfileID === targetProfileID || user.memberOf('Administrators')) {
											cache.profile[cacheKey] = true;
											resolve(true);
										}
										else {

											// get current action ID and all parent action ID's
											return getActionBranch('Profile', action)
												.then(function (actions) {

													if (!actions.length) {
														resolve(false);
													}
													else {

														var groups = [];
														user.Groups.forEach(function (g) {
															groups.push(g.ID);
														});

														var where =
															'ActionID IN (' + actions.join(',') + ') AND TargetProfileID = ' + targetProfileID + ' AND ' +
															'(' +
																'UserID = ' + userID + ' OR ProfileID = ' + user.ProfileID + ' OR ' +
																'GroupID IN (' + groups.join(',') + ')' +
															')';

														return db('PermissionProfile').whereRaw(where).first()
															.then(function (allowed) {
																cache.profile[cacheKey] = !!allowed;
																resolve(!!allowed);
															});
													}

												});

										}
									});

								}
							})
							.catch(function (err) {
								console.error(err);
								resolve(false);
							});

				}

			})
		},


		//
		// Lists all profiles the specified profile can perform a particular action for
		//
		listProfile: function (action, profileID) {
			return new Promise(function (resolve, reject) {
				var cacheKey = 'lp-' + profileID + '-' + action;

				if (cache.profile[cacheKey] !== undefined) {
					resolve(cache.profile[cacheKey]);
				}
				else {
					db.first(db.raw(
						'coalesce(a.UserID, gu.UserID) as ID ' +
						'from Profiles p ' +
						'left join Artists a on a.ProfileID = p.ID ' +
						'left join Galleries g on g.ProfileID = p.ID and g.Deleted = 0 ' +
						'left join GalleryUsers gu on gu.GalleryID = g.ID and gu.Deleted = 0 ' +
						'where p.ID = ' + profileID
					))
					.then(function (user) {
						if (!user) {
							resolve([]);
						}
						else {
							return Permission.Profile.list(action, user.ID)
								.then(function(profiles) {
									cache.profile[cacheKey] = profiles;
									resolve(profiles);
								});
						}
					})
					.catch(reject);
				}
			});
		},

		//
		// Lists all profiles the specified user can perform a particular action for
		//
		list: function (action, userID) {
			return new Promise(function (resolve, reject) {
				var cacheKey = 'l-' + userID + '-' + action;

				userID = userID * 1;

				if (cache.profile[cacheKey] !== undefined) {
					resolve(cache.profile[cacheKey]);
				}
				else {
					// get the profile and any groups associated with this user
					return AccessToken.getUserByID(userID)
						.then(function (user) {

							if (!user) {
								resolve([]);
							}
							else if (user.memberOf('Administrators')) {
								return db('Profiles').where('ID', '<>', user.ProfileID).select('ID').then(function (profiles) {
									var _profiles = profiles.map(function(p){ return p.ID; });
									cache.profile[cacheKey] = _profiles;
									resolve(_profiles);
								})
							}
							else {

								// get current action ID and all parent action ID's
								return getActionBranch('Profile', action)
									.then(function (actions) {

										if (!actions.length) {
											resolve([]);
										}
										else {

											var groups = [];
											user.Groups.forEach(function (g) {
												groups.push(g.ID);
											});

											var where =
												'ActionID IN (' + actions.join(',') + ') AND ' +
												'(' +
													'UserID = ' + userID + ' OR ProfileID = ' + user.ProfileID + ' OR ' +
													'GroupID IN (' + groups.join(',') + ')' +
												')';

											return db('PermissionProfile').whereRaw(where).select('TargetProfileID').distinct()
												.then(function (profiles) {
													var _profiles = profiles.map(function (p) {
														return p.TargetProfileID;
													});

													if (_profiles.indexOf(user.ProfileID) < 0) {
														_profiles.push(user.ProfileID);
													}

													cache.profile[cacheKey] = _profiles;
													resolve(_profiles);
												});
										}

									});

							}
						})
						.catch(reject);

				}
			})
		},
		
		
		//
		// Lists all profiles who are allowed to perform a particular action for the target profile
		//
		allowed: function (action, targetProfileID) {
			return new Promise(function (resolve, reject) {
				var cacheKey = 'a-' + targetProfileID + '-' + action;

				targetProfileID = targetProfileID * 1;

				if (cache.profile[cacheKey] !== undefined) {
					resolve(cache.profile[cacheKey]);
				}
				else {

					// get current action ID and all parent action ID's
					return getActionBranch('Profile', action).then(function (actions) {

							if (!actions.length) {
								resolve([]);
							}
							else {

								return db('PermissionProfile')
									.select('UserID', 'ProfileID', 'GroupID')
									.whereRaw('ActionID IN (' + actions.join(',') + ') AND TargetProfileID = ' + targetProfileID)
									.then(function (permissions) {

										if (!permissions.length) {
											resolve([]);
										}
										else {
											var profileIDs = [], queue = [];

											permissions.forEach(function (p) {
												if (p.ProfileID) {
													profileIDs.push(p.ProfileID);
												}
												else if (p.UserID) {
													queue.push(AccessToken.getUserByID(p.userID).then(function (user) {
														if (user) {
															profileIDs.push(user.ProfileID);
														}
													}))
												}
												else if (p.GroupID) {
													//TODO
												}
											});

											Promise.all(queue).then(function() {
												var uniqueIDs = [];
												profileIDs.forEach(function (id) {
													if (uniqueIDs.indexOf(id) < 0) {
														uniqueIDs.push(id);
													}
												});
												cache.profile[cacheKey] = uniqueIDs;
												resolve(uniqueIDs);
											})
										}

									});
							}

						});


				}
			})
		}
	},


	//
	// Handles user specific permissions
	//
	User: {}

};

module.exports = Permission;