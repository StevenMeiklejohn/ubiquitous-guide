var common = require('../utils/testHelper');


describe('Workspaces - ', function () {
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


  describe('List All Workspaces', function () {
    it('should list all artist workspaces', function (done) {
      request(endpoint)
      .get('/api/workspaces')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Description).toBeA('string');
        }
        done();
      });
    });
  }); // List All Workspaces


});