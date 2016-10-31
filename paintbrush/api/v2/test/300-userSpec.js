var common = require('../utils/testHelper');

describe('User', function () {

  before(function(done) {
    common.setupDB().then(function() {
      done();
    });
  });

  after(function(done) {
    common.cleanupDB().then(function() {
      done();
    })
  });


  describe('User - Search', function () {
    it('should search and find existing test users by email address', function (done) {
      request(endpoint)
        .post('/api/users/search')
        .send({
          "Pagination": { "PageSize": 10, "PageNumber": 0 },
          "Filters": {
            "Email": "test"
          }
        })
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function(err, res) {
          if(err) {
            throw(err);
          }
          res.body.should.have.property('Data');
          res.body.Data.should.be.instanceof(Array).and.have.lengthOf(10);
          res.body.Data[0].should.have.property('ID');
          done();
        });
    });
  });


  describe('User - Search', function () {
    it('should search and find existing test users with lots of filters', function (done) {

      db('Groups')
        .select('ID')
        .where('Name', 'Registered Users')
        .first()
        .then(function(group) {
          request(endpoint)
            .post('/api/users/search')
            .send({
              "Pagination": { "PageSize": 10, "PageNumber": 0 },
              "Filters": {
                "Email": "test",
                "Groups": [group.ID],
                "IsArtist": true,
                "IsGallery": false,
                "IsDeleted": false,
                "IsAuthorised": true
              }
            })
            .set('authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
              if(err) {
                throw(err);
              }
              expect(res.body).toExist();
              expect(res.body.Data.length).toEqual(5);
              expect(res.body.Data[0].Email).toEqual('artist1@test');
              done();
            });
        });
    });
  });


  describe('User - View', function () {
    it('should view existing test users', function (done) {

      db('Users')
        .orderBy('ID', 'asc')
        .first()
        .then(function(user) {

          request(endpoint)
            .get('/api/users/'+user.ID)
            .set('authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function (err, res) {
              if (err) {
                throw(err);
              }
              res.body.should.have.property('Email');
              res.body.should.have.property('Authorised');
              res.body.should.have.property('Groups');
              done();
            });
        });
    });
  });});
