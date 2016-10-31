var common = require('../utils/testHelper');


describe('Notifications -', function () {
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


  describe('Total Unread Notifications', function () {
    it('should list the total number of unread notifications for the current user', function (done) {
      request(endpoint)
      .get('/api/notifications/unread')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Unread).toBeMoreThan(1);
        done();
      });
    });
  }); // Total Unread Notifications


  describe('Read Notification', function () {
    it('should read a notification and mark the notification as read', function (done) {
      request(endpoint)
      .get('/api/notifications/5/read')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Success');
        done();
      });
    });
  }); // Read Notification


  describe('Read Notification (non existant)', function () {
    it('should fail to read a non existant notification', function (done) {
      request(endpoint)
      .get('/api/notifications/500/read')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Not Found');
        done();
      });
    });
  }); // Read Notification (non existant)


  describe('Read Notification (no permission)', function () {
    it('should fail to read a notification belonging to another user', function (done) {
      request(endpoint)
      .get('/api/notifications/21/read')
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
  }); // Read Notification (no permission)


  describe('Hide Notification', function () {
    it('should hide a notification (soft delete)', function (done) {
      request(endpoint)
      .get('/api/notifications/7/hide')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Success');
        done();
      });
    });
  }); // Hide Notification


  describe('Hide Notification (non existant)', function () {
    it('should fail to hide a non existant notification', function (done) {
      request(endpoint)
      .get('/api/notifications/500/hide')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Not Found');
        done();
      });
    });
  }); // Hide Notification (non existant)


  describe('Hide Notification (no permission)', function () {
    it('should fail to hide a notification belonging to another user', function (done) {
      request(endpoint)
      .get('/api/notifications/21/hide')
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
  }); // Hide Notification (no permission)


  describe('Total Unread Notifications (should be 2 less after reading / hiding)', function () {
    it('should list the total number of unred notifications for the current user', function (done) {
      request(endpoint)
      .get('/api/notifications/unread')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        console.log(res.body);
        expect(res.body.Unread).toEqual(8);
        done();
      });
    });
  }); // Total Unread Notifications


  describe('Search Notifications By Subject', function () {
    it('should search notifications by subject', function (done) {
      request(endpoint)
      .post('/api/notifications/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Subject': 'Subject 1' },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toEqual(2);
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].Subject).toBeA('string');
          expect(res.body.Data[i].Body).toBeA('string');
        }
        expect(res.body.Pagination).toExist();
        expect(res.body.Pagination.PageSize).toBeA('number');
        expect(res.body.Pagination.PageNumber).toBeA('number');
        expect(res.body.Pagination.TotalResults).toBeA('number');
        done();
      });
    });
  }); // Search Notifications By Subject


  describe('Search Notifications By Subject And Body', function () {
    it('should search notifications by subject and body', function (done) {
      request(endpoint)
      .post('/api/notifications/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Subject': 'Subject 1', 'Body': 'extra' },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toEqual(1);
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].Subject).toBeA('string');
          expect(res.body.Data[i].Body).toBeA('string');
        }
        expect(res.body.Pagination).toExist();
        expect(res.body.Pagination.PageSize).toBeA('number');
        expect(res.body.Pagination.PageNumber).toBeA('number');
        expect(res.body.Pagination.TotalResults).toBeA('number');
        done();
      });
    });
  }); // Search Notifications By Subject


  describe('Search Notifications (non existant)', function () {
    it('should search notifications, but find no results', function (done) {
      request(endpoint)
      .post('/api/notifications/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Subject': '-non-existant-', 'Body': '-non-existant-' },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toEqual(0);
        expect(res.body.Pagination).toExist();
        expect(res.body.Pagination.PageSize).toBeA('number');
        expect(res.body.Pagination.PageNumber).toBeA('number');
        expect(res.body.Pagination.TotalResults).toBeA('number');
        done();
      });
    });
  }); // Search Notifications (non existant)


  describe('Search Notifications (page out of bounds)', function () {
    it('should search notifications, but find no results', function (done) {
      request(endpoint)
      .post('/api/notifications/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 500 },
        'Filters': { 'Subject': 'Subject 1' },
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toEqual(0);
        expect(res.body.Pagination).toExist();
        expect(res.body.Pagination.PageSize).toBeA('number');
        expect(res.body.Pagination.PageNumber).toBeA('number');
        expect(res.body.Pagination.TotalResults).toBeA('number');
        done();
      });
    });
  }); // Search Notifications (page out of bounds)


})