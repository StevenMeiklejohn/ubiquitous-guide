var common = require('../utils/testHelper');


describe('Social - ', function () {
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


  describe('List Followers (current profile)', function () {
    it('should list all profiles following the specified profile (current profile)', function (done) {
      profileID = 1;
      request(endpoint)
      .get('/api/social/' + profileID + '/followers')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ProfileID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].ImageURI).toBeA('string');
        }
        done();
      });
    });
  }); // List Followers (current profile)


  describe('List Followers (another profile)', function () {
    it('should list all profiles following the specified profile (another profile)', function (done) {
      profileID = 2;
      request(endpoint)
      .get('/api/social/' + profileID + '/followers')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ProfileID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].ImageURI).toBeA('string');
        }
        done();
      });
    });
  }); // List Followers (another profile)


  describe('List Followers (no permission)', function () {
    it('should fail to list all profiles following the specified profile (non admin user)', function (done) {
      profileID = 1;
      request(endpoint)
      .get('/api/social/' + profileID + '/followers')
      .set('authorization', 'Bearer ' + token2)
      .expect('Content-Type', /json/)
      .expect(403)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('permission');
        done();
      });
    });
  }); // List Followers (no permission)


  describe('List Followers (bad parameter)', function () {
    it('should fail to list all profiles following the specified profile with bad parameter', function (done) {
      profileID = 'BadParameter';
      request(endpoint)
      .get('/api/social/' + profileID + '/followers')
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
  }); // List Followers (bad parameter)


  describe('List Following (current profile)', function () {
    it('should list all profiles being followed by the specified profile (current profile)', function (done) {
      profileID = 1;
      request(endpoint)
      .get('/api/social/' + profileID + '/following')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ProfileID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].ImageURI).toBeA('string');
        }
        done();
      });
    });
  }); // List Following (current profile)


  describe('List Following (another profile)', function () {
    it('should list all profiles being followed by the specified profile (another profile)', function (done) {
      profileID = 2;
      request(endpoint)
      .get('/api/social/' + profileID + '/following')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ProfileID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].ImageURI).toBeA('string');
        }
        done();
      });
    });
  }); // List Following (another profile)


  describe('List Following (no permission)', function () {
    it('should fail to list all profiles being followed by the specified profile (non admin user)', function (done) {
      profileID = 1;
      request(endpoint)
      .get('/api/social/' + profileID + '/following')
      .set('authorization', 'Bearer ' + token2)
      .expect('Content-Type', /json/)
      .expect(403)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('permission');
        done();
      });
    });
  }); // List Following (no permission)


  describe('List Following (bad parameter)', function () {
    it('should fail to list all profiles being followed by the specified profile with bad parameter', function (done) {
      profileID = 'BadParameter';
      request(endpoint)
      .get('/api/social/' + profileID + '/following')
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
  }); // List Following (bad parameter)


});