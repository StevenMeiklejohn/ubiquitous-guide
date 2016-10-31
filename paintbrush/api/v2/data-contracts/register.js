var Promise = require('bluebird'),
  AccessToken = require('../../auth/access-token'),
  Permission = require('../lib/permission'),
  service = require('../services/register'),
  ERROR = require('../error-codes'),
  is = require('../lib/validate').is;



  module.exports = {

    status: {
      check: function(req) {
            return new Promise(function(resolve){
              var register = req.body;

                if (!register.Email) {
                  resolve({ status: 400, body: ERROR('Please specify an email address') });
                }
                else if (register.Email.indexOf('@') < 0) {
                  resolve({ status: 400, body: ERROR('Email address does not appear to be valid') });
                }
                else {
                  service.post(register)
                    .then(function(data) {      
                        // no user exists yet with the specified email
                        if (!data) {
                          resolve({ Exists: 0 });
                        }
                        // registration is in progress or has been completed
                        else {
                          resolve({ Exists: 1, body: data });
                        }
                    })
                      .catch(function(err) {
                        processError(err, req, resolve, 'Unexpected error occured');
                        });
                }
          });
        },



       update: function (req) {
         return new Promise(function(resolve) {

             var registrationID = req.body.RegistrationID * 1,
               userID = req.body.UserID * 1;

             if (isNaN(registrationID)) {
               resolve({ status: 400, body: ERROR('Invalid Registration')});
             }
             else if (isNaN(userID)) {
               resolve({ status: 400, body: ERROR('Invalid UserID')});
             }
             else {
               service.variant.groups.get(userID)
                 .then(function (group) {

                   return service.variant.groups.update(groupID, data)
                     .then(function () {
                       resolve({ status: 200, body: { Message: 'Success' } });
                     });
                   // TODO: check current user has permission to update group
                 })
                 .catch(function (err) {
                   processError(err, req, resolve, 'Unexpected error occurred');
                 });

             }
           });
       }
  },
     


     create: {

      user:function(req) {
        return new Promise(function(resolve, reject) {
          db('Users').insert(user)
            .then(function (id) {
              resolve(id[0]);
            })
            .catch(function (err) {
              if (err.status) {
                resolve({ status: 200, body: { Message: err.Message } });
              }
              else {
                resolve({ status: 500, body: { Message: 'Unknown error occurred'} }); 
                }
              });
            });
          },


      profile:function(req){


      var registrationID = req.body.RegistrationID * 1;
      var userID = req.body.UserID * 1;
      return new Promise(function(resolve, reject) {

      if (isNaN(registrationID)) {
        res.status(400).json({ Message: 'Invalid RegistrationID' });
      }
      else if (isNaN(userID)) {
        res.status(400).json({ Message: 'Invalid UserID' });
      }
      else if ((!req.body.Artist && !req.body.Gallery) || (req.body.Artist && req.body.Gallery)) {  
        res.status(400).json({ Message: 'Please specify either an artist or gallery profile to create.' });
      }
      else {
        service.post(profile)
        .then(function (profile) {

        });

        db('ContactInformation').insert({ Website: req.body.Website || null, Address1: '', Address2: '', Address3: '', Town: '', Postcode: '', Mobile: '', Landline: '' })
          .then(function(contactInfo) {

            db('Profiles').insert({
              Name: req.body.Name,
              ImageURI: req.body.ImageURI,
              ActivCanvasStatusID: 1,
              ContactInformationID: contactInfo[0]
            })
            .then(function (profile) {
              var Task = require('../utils/tasks');

              // link registration record to profile
              return db('Registrations').where({ ID: registrationID }).update({ ProfileID: profile[0] })
                .then(function () {

                  // create a new artist record
                  if (req.body.Artist) {
                    return db('Artists').insert({
                      UserID: userID,
                      ProfileID: profile[0],
                      Location: req.body.Location
                    });                  }
                  // create a new gallery record
                  else if (req.body.Gallery) {
                    return db('Galleries').insert({
                      ProfileID: profile[0]
                    })
                    .then(function (gallery) {
                      return db('GalleryUsers').insert({
                        UserID: userID,
                        GalleryID: gallery[0]
                      });
                    });
                  }
                })
                .then(function () {

                  // create a new task notification to encourage the user to fill out the rest of their profile
                  //return Task.startGroup(profile[0], 'complete-profile', true);
                })
                .then(function () {

                  // mark upload profile image task as completed
                  if (req.body.ImageURI) {
                    //return Task.complete(profile[0], 'profile-image');
                  }
                })
                .then(function () {
                  res.json({ ProfileID: profile[0] });
                });

            })
            .catch(function (err) {
              logError(err, req, function () {
                res.status(500).json({ Message: 'Unexpected error occurred' });
              });
            });

          });
        }
      });
  },


      


      consumer:function(req){

        return new Promise(function(resolve, reject) {
         Registration.createConsumer(req.body)
           .then(function (consumer) {
             res.json({ UserID: consumer.UserID, ProfileID: consumer.ProfileID, Message: 'Success' });
           })
           .catch(function (err) {
             if (err.Status) {
               res.status(err.Status).json({ Message: err.Message });
             }
             else {
               logError(err, req, function () {
                 res.status(500).json({ Message: 'Unexpected error occurred' });
               });
             }
           });
      })
}
},


complete: {

  registration:function(req){

      return new Promise(function(resolve, reject) {
       var registrationID = req.body.RegistrationID * 1,
         userID = req.body.UserID * 1;

       if (isNaN(registrationID)) {
         res.status(400).json({ Message: 'Invalid RegistrationID' });
       }
       else if (isNaN(userID)) {
         res.status(400).json({ Message: 'Invalid UserID' });
       }
       else {
         // check registration and user records exist
         db.first('r.*')
         .from('Registrations as r')
         .join('Users as u', 'r.ID', 'u.RegistrationID')
         .then(function (registration) {
           if (!registration) {
             res.status(404).json({ Message: 'Registration record not found or does not belong to the specified user.' });
           }
           else {

             // unlink user account from registration record so they are not forced to the registration form when they next log in
             return db('Users')
             .where({ ID: userID, RegistrationID: registrationID })
             .update({ RegistrationID: null })
             .then(function () {
               res.json({ Message: 'Success' });
             });

           }
         })
         .catch(function (err) {
           logError(err, req, function () {
             res.status(500).json({ Message: 'Unexpected error occurred' });
           });
         });
       }
      });
}
}

};













