var Promise = require('bluebird');


var service = {

  status: {

add: function(register) {
  return new Promise(function(resolve, reject) {
    db.first(
      'u.ID as UserID',
      'u.RegistrationID',
      'r.ProfileID',
      'r.Step',
      'r.Type',
      'r.TotalSteps',
      'r.CompletedSteps'
    )
    .from('Users as u')
    .leftJoin('Registrations as r', 'u.RegistrationID', 'r.ID')
    .where({ Email: req.body.Email });
  });
},


update: function (registrationID, Users) {
  return new Promise(function(resolve, reject) {
    service.get(registrationID)
      .then(function (data) {
        return db('registration').first().where('ID', registrationID)
          .join('Users as u', 'r.ID', 'u.RegistrationID')
          .then(function (registration) {
            if (!registration) {
              res.status(404).json({ Message: 'Registration record not found or does not belong to the specified user.' });
            }
            else {
              db('Registrations')
              .where('ID', registrationID)
              .update({
                Step: req.body.Step,
                Type: req.body.Type,
                CompletedSteps: req.body.CompletedSteps,
                TotalSteps: req.body.TotalSteps
              });
            }
          });
        });
      });
}

},


  create : {





},



  complete : {



  }



};



