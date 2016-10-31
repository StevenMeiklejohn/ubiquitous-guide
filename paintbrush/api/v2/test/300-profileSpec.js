var common = require('../utils/testHelper');


describe('Profile - ', function () {
  before(function (done) {
    common.setupDB().then(function() {
      done();
    });
  });
  after(function (done) {
    common.cleanupDB().then(function() {
      done();
    });
  });


  describe('View Profile', function () {
    it('should view the profile of an existing user', function (done) {
      db('Profiles')
      .orderBy('ID', 'asc')
      .first()
      .then(function (profile) {
        //console.log('Got profile ' + profile.ID);
        request(endpoint)
          .get('/api/profile/' + profile.ID)
          .set('authorization', 'Bearer ' + token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) throw(err);
            //console.log(res.body);
            expect(res.body).toExist();
            expect(res.body.ID).toExist();
            expect(res.body.Name).toEqual('Artist 1');
            expect(res.body.ImageURI).toEqual('/img/test-data/profile-t.png');
            expect(res.body.Contact.Address1).toEqual('address1');
            expect(res.body.Contact.Address2).toEqual('address2');
            expect(res.body.Contact.Address3).toNotExist();
            expect(res.body.Contact.Town).toEqual('town');
            expect(res.body.Contact.Postcode).toEqual('postcode');
            expect(res.body.Contact.Website).toEqual('http://www.artretailnetwork.com');
            expect(res.body.Contact.Landline).toEqual('0141 000 111');
            expect(res.body.Contact.Mobile).toEqual('071234567890');
            expect(res.body.Gallery).toNotExist();
            expect(res.body.Artist.Nationality).toNotExist();
            done();
          });
      });
    });
  }); // View Profile


  describe('View Profile (non existant)', function () {
    it('should fail to view the profile of non existant user', function (done) {
      var profileID = 999999;
      request(endpoint)
        .get('/api/profile/' + profileID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Not Found');
          done();
        });
    });
  }); // View profile (non existant)


  describe('View Profile (bad parameter)', function () {
    it('should fail to view the profile of user with bad parameter', function (done) {
      var profileID = 'BadParameter';
      request(endpoint)
        .get('/api/profile/' + profileID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Invalid');
          done();
        });
    });
  }); // View Profile (bad parameter)


  describe('Update Profile', function () {
    it('should update the profile of an existing user', function (done) {
      db('Profiles').select('ID').orderBy('ID', 'ASC').offset(3).limit(1)
      .then(function (profile) {
        var BarbraStreisand = Math.floor((Math.random() * 300) + 300);
        request(endpoint)
          .put('/api/profile/' + profile[0].ID + '/update')
          .set('authorization', 'Bearer ' + token)
          .send({
            'Name': 'Barbra' + BarbraStreisand,
            'ImageURI': '/img/test-data/' + BarbraStreisand + '.png',
            'Contact': {
              'Address1': 'Address1-' + BarbraStreisand,
              'Address2': 'Address2-' + BarbraStreisand,
              'Address3': 'Address3-' + BarbraStreisand,
              'Town': 'Town-' + BarbraStreisand,
              'Postcode': 'Postcode-' + BarbraStreisand,
              'Website': 'www.site-' + BarbraStreisand + '.com',
              'Landline': '0141 ' + BarbraStreisand,
              'Mobile': '077 ' + BarbraStreisand
            }
          })
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) throw(err);
            //console.log(res.body);
            expect(res.body).toExist();
            expect(res.body.Message).toEqual('Success');

            // check the record was updated with the correct values
            request(endpoint)
            .get('/api/profile/' + profile[0].ID)
            .set('authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
              if(err) throw(err);
              //console.log(res.body);
              expect(res.body).toExist();
              expect(res.body.ID).toExist();
              expect(res.body.Name).toEqual('Barbra' + BarbraStreisand);
              expect(res.body.ImageURI).toEqual('/img/test-data/' + BarbraStreisand + '.png');
              expect(res.body.Contact.Address1).toEqual('Address1-' + BarbraStreisand);
              expect(res.body.Contact.Address2).toEqual('Address2-' + BarbraStreisand);
              expect(res.body.Contact.Address3).toEqual('Address3-' + BarbraStreisand);
              expect(res.body.Contact.Town).toEqual('Town-' + BarbraStreisand);
              expect(res.body.Contact.Postcode).toEqual('Postcode-' + BarbraStreisand);
              expect(res.body.Contact.Website).toEqual('www.site-' + BarbraStreisand + '.com');
              expect(res.body.Contact.Landline).toEqual('0141 ' + BarbraStreisand);
              expect(res.body.Contact.Mobile).toEqual('077 ' + BarbraStreisand);
              done();
            });
          });
      });
    });
  }); // Update Profile


  describe('Update Profile (non existant)', function () {
    it('should fail to update the profile of non existant user', function (done) {
      var profileID = 999999;
      request(endpoint)
        .put('/api/profile/' + profileID + '/update')
        .set('authorization', 'Bearer ' + token)
        .send({
          'Name': 'Barbra - should fail',
          'ImageURI': '/img/test-data/image.png - should fail',
          'Contact': {
            'Address1': 'Address1 - should fail',
            'Address2': 'Address2 - should fail',
            'Address3': 'Address3 - should fail',
            'Town': 'Town - should fail',
            'Postcode': 'Postcode - should fail',
            'Website': 'www.site.com  - should fail',
            'Landline': '0141  - should fail',
            'Mobile': '077  - should fail'
          }
        })
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('not found');
          done();
        });
    });
  }); // Update Profile (non existant)


  describe('Update Profile (bad parameter)', function () {
    it('should fail to update the profile of user with bad parameter', function (done) {
      var profileID = 'BadParameter';
      request(endpoint)
        .put('/api/profile/' + profileID + '/update')
        .set('authorization', 'Bearer ' + token)
        .send({
          'Name': 'Barbra - should fail',
          'ImageURI': '/img/test-data/image.png - should fail',
          'Contact': {
            'Address1': 'Address1 - should fail',
            'Address2': 'Address2 - should fail',
            'Address3': 'Address3 - should fail',
            'Town': 'Town - should fail',
            'Postcode': 'Postcode - should fail',
            'Website': 'www.site.com  - should fail',
            'Landline': '0141  - should fail',
            'Mobile': '077  - should fail'
          }
        })
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Invalid');
          done();
        });
    });
  }); // Update Profile (bad parameter)


  describe('Update Profile (no permission)', function () {
    it('should fail to update the profile of another user - non admin', function (done) {
      var profileID = 8;
      request(endpoint)
        .put('/api/profile/' + profileID + '/update')
        .set('authorization', 'Bearer ' + token2)
        .send({
          'Name': 'Barbra - should fail',
          'ImageURI': '/img/test-data/image.png - should fail',
          'Contact': {
            'Address1': 'Address1 - should fail',
            'Address2': 'Address2 - should fail',
            'Address3': 'Address3 - should fail',
            'Town': 'Town - should fail',
            'Postcode': 'Postcode - should fail',
            'Website': 'www.site.com  - should fail',
            'Landline': '0141  - should fail',
            'Mobile': '077  - should fail'
          }
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          console.log(res.body);
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('permission');
          done();
        });
    });
  }); // Update Profile (no permission)


  describe('Follow Profile', function () {
    it('should follow an existing profile', function (done) {
      db('Profiles').select('ID').orderBy('ID', 'ASC').offset(3).limit(1)
      .then(function (profile) {
        request(endpoint)
          .get('/api/profile/' + profile[0].ID + '/action/follow')
          .set('authorization', 'Bearer ' + token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) throw(err);
            //console.log(res.body);
            expect(res.body).toExist();
            // when following, 'success' or 'already following' messages are both acceptable
            expect(['Success', 'Already following profile'].indexOf(res.body.Message)).toNotBe(-1);

            // check the record was updated with the correct values
            db('Followers').count('ID as total').where({ ProfileID: testUser.ProfileID, FollowingProfileID: profile[0].ID })
            .then(function (result) {
              expect(result[0].total).toEqual(1);
              done();
            })
            .catch(function (err){
              throw(err);
            })

          });
      })
      .catch(function (err){
      	throw(err);
      })
    });
  }); // Follow Profile


  describe('Follow Profile (non existant)', function () {
    it('should fail to follow non existant profile', function (done) {
      var profileID = 999999;
      request(endpoint)
        .get('/api/profile/' + profileID + '/action/follow')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Not Found');
          done();
        });
    });
  }); // Follow Profile (non existant)


  describe('Follow Profile (bad parameter)', function () {
    it('should fail to follow profile - bad parameter', function (done) {
      var profileID = 'BadParameter';
      request(endpoint)
        .get('/api/profile/' + profileID + '/action/follow')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Invalid');
          done();
        });
    });
  }); // Follow Profile (bad parameter)


  describe('Unfollow Profile', function () {
    it('should unfollow an existing profile', function (done) {
      db('Profiles').select('ID').orderBy('ID', 'ASC').offset(3).limit(1)
      .then(function (profile) {
        request(endpoint)
          .get('/api/profile/' + profile[0].ID + '/action/unfollow')
          .set('authorization', 'Bearer ' + token)
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function (err, res) {
            if(err) throw(err);
            expect(res.body).toExist();
            expect(res.body.Message).toEqual('Success');

            // check the operation was successful
            db('Followers').count('ID as total').where({ ProfileID: testUser.ProfileID, FollowingProfileID: profile[0].ID })
            .then(function (result) {
              expect(result[0].total).toEqual(0);
              done();
            })
            .catch(function (err){
              throw(err);
            })

          });
      })
      .catch(function (err){
        throw(err);
      })
    });
  }); // Unfollow Profile


  describe('Unfollow Profile (non existant)', function () {
    it('should fail to unfollow non existant profile', function (done) {
      var profileID = 999999;
      request(endpoint)
        .get('/api/profile/' + profileID + '/action/unfollow')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Not Found');
          done();
        });
    });
  }); // Unfollow Profile (non existant)


  describe('Unfollow Profile (bad parameter)', function () {
    it('should fail to unfollow profile - bad parameter', function (done) {
      var profileID = 'BadParameter';
      request(endpoint)
        .get('/api/profile/' + profileID + '/action/unfollow')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Invalid');
          done();
        });
    });
  }); // Unfollow Profile (bad parameter)


  describe('Featured Artwork', function (){
    it('should list featured artwork for specified profile', function (done) {
      var profileID = 1;
      request(endpoint)
      .get('/api/profile/' + profileID + '/featured-art')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeMoreThan(0);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].Description).toBeA('string');
          expect(res.body[i].ImageURI).toBeA('string');
          expect(res.body[i].WidthMM).toBeA('number');
          expect(res.body[i].HeightMM).toBeA('number');
          expect(res.body[i].DepthMM).toBeA('number');
          expect(res.body[i].Type).toBeA('string');
        }
        done();
      });
    });
  }); // Featured Artwork


}); // Profile
