var common = require('../utils/testHelper');


describe('Question - ', function () {
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


  describe('List Artist Question Types', function () {
    it('should list all current artist question types', function (done) {
      request(endpoint)
      .get('/api/question/artist/types')
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
        }
        done();
      });
    });
  }); // List Artist Question Types


  describe('List Artist Questions Of Type', function () {
    it('should list all artist questions of the specified type', function (done) {
      var typeID = 1;
      request(endpoint)
      .get('/api/question/artist/list/' + typeID)
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Text).toBeA('string');
          expect(res.body[i].TypeID).toBe(typeID);
          expect(res.body[i].Priority).toBeA('number');
        }
        done();
      });
    });
  }); // List Artist Questions Of Type


  describe('List Artist Questions Of Type (bad parameter)', function () {
    it('should fail to list all artist questions with bad type', function (done) {
      var typeID = 'BadParameter';
      request(endpoint)
      .get('/api/question/artist/list/' + typeID)
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('numeric');
        done();
      });
    });
  }); // List Artist Questions Of Type (bad parameter)


});