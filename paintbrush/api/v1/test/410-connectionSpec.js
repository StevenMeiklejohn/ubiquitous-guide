var common = require('../utils/testHelper');


describe('Connections -', function () {
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


  // random test data
  var FreddieMercury = Math.floor((Math.random() * 999) + 1000);
  var testConnectionID


  describe('Request Connection', function () {
    it('should request a connection from the current profile', function (done) {
      var profileID = 3;
      request(endpoint)
      .post('/api/connections/connect')
      .set('authorization', 'Bearer ' + token)
      .send({
        'ProfileID': profileID,
        'Message': 'Test connection request ' + FreddieMercury
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Success');

        // check the request has been created
        db('Connections').first('ID', 'Message').where({ ProfileID: testUser.ProfileID, ConnectedProfileID: profileID })
        .asCallback(function (err, connection){
          if(err) throw(err);
          expect(connection.ID).toExist();
          expect(connection.Message).toBe('Test connection request ' + FreddieMercury);
          done();
        });
      });
    });
  }); // Request Connection


  describe('Request Connection', function () {
    it('should update a connection from the current profile where connection already exists', function (done) {
      var profileID = 4;
      request(endpoint)
        .post('/api/connections/connect')
        .set('authorization', 'Bearer ' + token)
        .send({
          'ProfileID': profileID,
          'Message': 'Test connection request ' + FreddieMercury
        })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toEqual('You have already successfully connected to this profile');
          done();
        });
    });
  }); // Request Connection


  describe('Request Connection (bad profile)', function () {
    it('should fail to request a connection to a bad profile', function (done) {
      var profileID = "BadParameter"
      request(endpoint)
      .post('/api/connections/connect')
      .set('authorization', 'Bearer ' + token)
      .send({
        'ProfileID': profileID,
        'Message': 'Hi, this is a test connection request'
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
  }); // Request Connection (bad profile)


  describe('Accept Connection Request', function () {
    it('should accept a connection request made to the current profile', function (done) {
      // fetch connection request details
      db('Connections').first('ID').where({ 'ConnectedProfileID': testUser.ProfileID, 'Accepted': 0 })
      .asCallback(function (err, connection){
        request(endpoint)
        .get('/api/connections/accept/' + connection.ID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toEqual('Success');

          // check the request has been accepted
          db('Connections').first().where({ ID: connection.ID })
          .asCallback(function (err, connCheck){
            if(err) throw(err);
            expect(connCheck.Accepted).toEqual(1);
            done();
          });
        });
      });
    });
  }); // Accept Connection Request


  describe('Accept Connection Request (bad parameter)', function () {
    it('should fail to accept a connection with bad parameter', function (done) {
      var connectionID = 'BadParameter';
      request(endpoint)
      .get('/api/connections/accept/' + connectionID)
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
  }); // Accept Connection Request (bad parameter)


  describe('Accept Connection Request (non existing)', function () {
    it('should fail to accept a connection with bad parameter', function (done) {
      var connectionID = 999999;
      request(endpoint)
      .get('/api/connections/accept/' + connectionID)
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('not found');
        done();
      });
    });
  }); // Accept Connection Request (non existing)


  describe('Accept Connection Request (no permission)', function () {
    it('should fail to accept a connection request for another user', function (done) {
      // fetch connection request details
      db('Connections').first('ID').where('ConnectedProfileID', '!=', testUser.ProfileID)
      .asCallback(function (err, connection){
        request(endpoint)
        .get('/api/connections/accept/' + connection.ID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('permission');
          done();
        });
      });
    });
  }); // Accept Connection Request (no permission)


  describe('Reject Connection Request', function () {
    it('should reject a connection request made to the current profile', function (done) {
      // fetch connection request details
      db('Connections').first('ID').where({ 'ConnectedProfileID': testUser.ProfileID, 'Accepted': 0 })
      .asCallback(function (err, connection){
        request(endpoint)
        .get('/api/connections/reject/' + connection.ID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toEqual('Success');

          // check the request has been rejected
          db('Connections').first().where({ ID: connection.ID })
          .asCallback(function (err, connCheck){
            if(err) throw(err);
            expect(connCheck.Accepted).toEqual(-1);
            done();
          });
        });
      });
    });
  }); // Reject Connection Request


  describe('Reject Connection Request (bad parameter)', function () {
    it('should fail to reject a connection with bad parameter', function (done) {
      var connectionID = 'BadParameter';
      request(endpoint)
      .get('/api/connections/reject/' + connectionID)
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
  }); // Reject Connection Request (bad parameter)


  describe('Reject Connection Request (non existing)', function () {
    it('should fail to reject a connection with bad parameter', function (done) {
      var connectionID = 999999;
      request(endpoint)
      .get('/api/connections/reject/' + connectionID)
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('Not found');
        done();
      });
    });
  }); // Reject Connection Request (non existing)


  describe('Reject Connection Request (no permission)', function () {
    it('should fail to reject a connection request for another user', function (done) {
      // fetch connection request details
      db('Connections').first('ID').where('ConnectedProfileID', '!=', testUser.ProfileID)
      .asCallback(function (err, connection){
        request(endpoint)
        .get('/api/connections/reject/' + connection.ID)
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(403)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('permission');
          done();
        });
      });
    });
  }); // Reject Connection Request (no permission)


  describe('List Pending Connections', function () {
    it('should list all pending connections for current user', function (done) {
      request(endpoint)
      .get('/api/connections/pending')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
        }
        done();
      });
    });
  }); // List Pending Connections


  describe('List Accepted Connections', function () {
    it('should list all accepted connections for current user', function (done) {
      request(endpoint)
      .get('/api/connections/accepted')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
        }
        done();
      });
    });
  }); // List Accepted Connections


  describe('List Rejected Connections', function () {
    it('should list all rejected connections for current user', function (done) {
      request(endpoint)
      .get('/api/connections/rejected')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
        }
        done();
      });
    });
  }); // List Rejected Connections


  describe('Search Connections By Name', function () {
    it('should search and sort connections by requestor\'s name', function (done) {
      request(endpoint)
      .post('/api/connections/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Name': 'artist' },
        'Sort': { 'SortField': 'Name', 'SortOrder': 0 }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBeMoreThan(0);
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ConnectionID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].Name).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].Accepted).toBeA('number');
        }
        expect(res.body.Pagination).toExist();
        expect(res.body.Pagination.PageSize).toBeA('number');
        expect(res.body.Pagination.PageNumber).toBeA('number');
        expect(res.body.Pagination.TotalResults).toBeA('number');
        done();
      });
    });
  }); // Search Connections By Name


  describe('Search Connections By Name (non existant)', function () {
    it('should search connections by name, but fail to find any results', function (done) {
      request(endpoint)
      .post('/api/connections/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Name': 'Ecclefechin' }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data).toNotExist();
        expect(res.body.Pagination).toExist();
        expect(res.body.Pagination.PageSize).toBeA('number');
        expect(res.body.Pagination.PageNumber).toBeA('number');
        expect(res.body.Pagination.TotalResults).toBeA('number');
        done();
      });
    });
  }); // Search Connections By Name (non existant)


})