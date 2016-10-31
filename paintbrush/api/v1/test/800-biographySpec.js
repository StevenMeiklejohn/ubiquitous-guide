var common = require('../utils/testHelper');


describe('Biography - ', function () {
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


  describe('View Biography', function () {
    it('should view a profile biography', function (done) {
      var profileID = 1;
      request(endpoint)
        .get('/api/biography/' + profileID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Description).toBeA('string');
          done();
        });
    });
  }); // View Biography


  describe('View Biography (non existant)', function () {
    it('should fail to view non existant biography', function (done) {
      var profileID = 999999;
      request(endpoint)
        .get('/api/biography/' + profileID)
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
  }); // View Biography (non existant)


  describe('View Biography (bad parameter)', function () {
    it('should fail to view biography with bad parameter', function (done) {
      var profileID = 'BadParameter';
      request(endpoint)
        .get('/api/biography/' + profileID)
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
  }); // View Biography (bad parameter)


  describe('Update Biography', function () {
    it('should update a profile biography', function (done) {
      var profileID = 1;
      request(endpoint)
        .put('/api/biography/' + profileID + '/update')
        .set('authorization', 'Bearer ' + token)
        .send({
          Description: 'Updated biography data'
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toBe('Success');
          done();
        });
    });
  }); // Update Biography


  describe('Update Biography (no permission)', function () {
    it('should fail to update a profile biography', function (done) {
      var profileID = 7;
      request(endpoint)
        .put('/api/biography/' + profileID + '/update')
        .set('authorization', 'Bearer ' + token2)
        .send({
          Description: 'Updated biography data'
        })
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('permission');
          done();
        });
    });
  }); // Update Biography (no permission)


  describe('Update Biography (bad parameter)', function () {
    it('should fail to update a profile biography with bad parameter', function (done) {
      var profileID = 'BadParameter';
      request(endpoint)
        .put('/api/biography/' + profileID + '/update')
        .set('authorization', 'Bearer ' + token)
        .send({
          Description: 'Updated biography data'
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
  }); // Update Biography (bad parameter)


});