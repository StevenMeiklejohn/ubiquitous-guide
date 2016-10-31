var common = require('../utils/testHelper');


describe('Artist - ', function () {
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


  describe('List Artist Age Brackets', function () {
    it('should list all current age brackets', function (done) {
      request(endpoint)
      .get('/api/artist/age-brackets')
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
  }); // List Artist Age Brackets


  describe('List Artist Types', function () {
    it('should list all current artist types', function (done) {
      request(endpoint)
      .get('/api/artist/types')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Type).toBeA('string');
          expect(res.body[i].Description).toBeA('string');
        }
        done();
      });
    });
  }); // List Artist Types


});