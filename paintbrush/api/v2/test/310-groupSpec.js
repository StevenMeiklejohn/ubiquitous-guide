var common = require('../utils/testHelper');


describe('Groups -', function () {
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


  var totalGroups;
  var testGroupID;


  describe('List Groups', function () {
    it('should list the current user groups', function (done) {
      request(endpoint)
      .get('/api/groups')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeMoreThan(0);
        totalGroups = res.body.length;
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].Description).toBeA('string');
        }
        done();
      });
    });
  }); // List Groups


  describe('Add Group', function () {
    it('should add a user group', function (done) {
      request(endpoint)
      .post('/api/groups/add')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Group',
        Description: 'Test Group Description'
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.ID).toBeA('number');
        // check group was created
        db('Groups').first().where({ ID: res.body.ID })
        .asCallback(function (err, group){
          if(err) throw(err);
          expect(group.ID).toBeA('number');
          expect(group.Name).toEqual('Test Group');
          expect(group.Description).toEqual('Test Group Description');
          testGroupID = group.ID;
          done();
        })
      });
    });
  }); // Add Group


  describe('View Group Details', function () {
    it('should show the group details and list members', function (done) {
      var groupID = 2;
      request(endpoint)
      .get('/api/groups/' + groupID)
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Name).toBeA('string');
        expect(res.body.Description).toBeA('string');
        expect(res.body.Members).toExist();
        expect(res.body.Members.length).toBeGreaterThan(0);
        for(i = 0; i < res.body.Members.length; i++){
          expect(res.body.Members[i].ID).toBeA('number');
          expect(res.body.Members[i].Email).toBeA('string');
        }
        done();
      });
    });
  }); // View Group Details


  describe('View Group Details (non existant)', function () {
    it('should fail to show details for non existant group', function (done) {
      var groupID = 999999;
      request(endpoint)
      .get('/api/groups/' + groupID)
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
  }); // View Group Details (non existant)


  describe('View Group Details (bad parameter)', function () {
    it('should fail to show details for non existant group', function (done) {
      var groupID = 'BadParameter';
      request(endpoint)
      .get('/api/groups/' + groupID)
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
  }); // View Group Details (bad parameter)


  describe('Update Group', function () {
    it('should update a group\'s details', function (done) {
      request(endpoint)
      .put('/api/groups/' + testGroupID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Group (Updated)',
        Description: 'Test Group Description (Updated)'
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Success');
        // check group was updated
        db('Groups').first().where({ ID: testGroupID })
        .asCallback(function (err, group){
          if(err) throw(err);
          expect(group.ID).toEqual(testGroupID);
          expect(group.Name).toEqual('Test Group (Updated)');
          expect(group.Description).toEqual('Test Group Description (Updated)');
          done();
        })
      });
    });
  }); // Update Group


  describe('Update Group (non existant)', function () {
    it('should fail to update a non existant group\'s details', function (done) {
      var groupID = 999999;
      request(endpoint)
      .put('/api/groups/' + groupID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Group (Should have failed)',
        Description: 'Test Group Description (Should have failed)'
      })
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('Not Found');
        done();
      });
    });
  }); // Update Group (non existant)


  describe('Update Group (bad parameter)', function () {
    it('should fail to update a group with bad parameter', function (done) {
      var groupID = 'BadParameter';
      request(endpoint)
      .put('/api/groups/' + groupID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Group (Should have failed)',
        Description: 'Test Group Description (Should have failed)'
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
  }); // Update Group (bad parameter)


  describe('Update Group (missing parameter)', function () {
    it('should fail to update a group with bad parameter', function (done) {
      var groupID = testGroupID;
      request(endpoint)
      .put('/api/groups/' + groupID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Group (Should have failed)'
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('description');
        done();
      });
    });
  }); // Update Group (missing parameter)


  describe('Delete Group', function () {
    it('should mark a group as deleted', function (done) {
      var groupID = testGroupID;
      request(endpoint)
      .delete('/api/groups/' + groupID + '/remove')
      .set('authorization', 'Bearer ' + token)
      .expect(204)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toEqual({});
        done();
      });
    });
  }); // Delete Group


  describe('Delete Group (non existant)', function () {
    it('should fail to mark non existant group as deleted', function (done) {
      var groupID = 999999;
      request(endpoint)
      .delete('/api/groups/' + groupID + '/remove')
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
  }); // Delete Group (non existant)


  describe('Delete Group (bad parameter)', function () {
    it('should fail to mark group as deleted with bad parameter', function (done) {
      var groupID = 'BadParameter';
      request(endpoint)
      .delete('/api/groups/' + groupID + '/remove')
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
  }); // Delete Group (bad parameter)


});