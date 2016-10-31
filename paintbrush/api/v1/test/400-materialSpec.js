var common = require('../utils/testHelper');


describe('Materials -', function () {
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


  var initialUserID = testUser.ID;


  // random test data
  var GuthrieGovan = Math.floor((Math.random() * 999) + 1000);
  var testMaterialID


  describe('List All Materials', function () {
    it('should list all the current materials', function (done) {
      request(endpoint)
      .get('/api/materials')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeMoreThan(10);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].Description).toBeA('string');
        }
        done();
      });
    });
  }); // List All Materials


  describe('Add Material', function () {
    it('should add a material', function (done) {
      request(endpoint)
      .post('/api/materials/add')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Material ' + GuthrieGovan,
        Description: 'Test Material Description ' + GuthrieGovan
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.ID).toBeA('number');
        expect(res.body.Message).toEqual('Success');
        testMaterialID = res.body.ID;
        // check material was created
        db('Materials').first().where({ ID: testMaterialID })
        .asCallback(function (err, material){
          if(err) throw(err);
          expect(material.ID).toEqual(testMaterialID);
          expect(material.Name).toEqual('Test Material ' + GuthrieGovan);
          expect(material.Description).toEqual('Test Material Description ' + GuthrieGovan);
          done();
        })
      });
    });
  }); // Add Material


  describe('Add Material (missing parameter)', function () {
    it('should fail to add a material with missing parameter', function (done) {
      request(endpoint)
      .post('/api/materials/add')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Test Material ' + GuthrieGovan + 1,
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('name and description');
        done();
      });
    });
  }); // Add Material (missing parameter)


  describe('Update Material', function () {
    it('should update a material', function (done) {
      request(endpoint)
      .put('/api/materials/' + testMaterialID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Updated Name ' + GuthrieGovan,
        Description: 'Updated Description ' + GuthrieGovan
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Success');
        // check material was updated
        db('Materials').first().where({ ID: testMaterialID })
        .asCallback(function (err, material){
          if(err) throw(err);
          expect(material.ID).toEqual(testMaterialID);
          expect(material.Name).toEqual('Updated Name ' + GuthrieGovan);
          expect(material.Description).toEqual('Updated Description ' + GuthrieGovan);
          done();
        })
      });
    });
  }); // Update Material


  describe('Update Material (non existant)', function () {
    it('should fail to update non existant material', function (done) {
      var materialID = 999999;
      request(endpoint)
      .put('/api/materials/' + materialID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Updated Name - should fail',
        Description: 'Updated Description - should fail'
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
  }); // Update Material (non existant)


  describe('Update Material (bad parameter)', function () {
    it('should fail to update material with bad parameter', function (done) {
      var materialID = 'BadParameter';
      request(endpoint)
      .put('/api/materials/' + materialID + '/update')
      .set('authorization', 'Bearer ' + token)
      .send({
        Name: 'Updated Name - should fail',
        Description: 'Updated Description - should fail'
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
  }); // Update Material (bad parameter)


   // *** switch to non admin token ***
  describe('Update Material (no permission)', function () {
    it('should fail to update a material - user not administrator', function (done) {
      request(endpoint)
      .put('/api/materials/' + testMaterialID + '/update')
      .set('authorization', 'Bearer ' + token2)
      .send({
        Name: 'Updated Name ' + GuthrieGovan,
        Description: 'Updated Description ' + GuthrieGovan
      })
      .expect('Content-Type', /json/)
      .expect(403)
      .end(function (err, res) {
        if(err) throw(err);
        console.log(res.body);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('permission');
        done();
      });
    })
  }); // Update Material (no permission)


  describe('Remove Material', function () {
    it('should remove a material', function (done) {
      request(endpoint)
      .delete('/api/materials/' + testMaterialID + '/remove')
      .set('authorization', 'Bearer ' + token)
      .expect(204)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toEqual({});
        done();
      });
    });
  }); // Remove Material


  describe('Remove Material (non existant)', function () {
    it('should fail to remove a non existant material', function (done) {
      var materialID = 999999;
      request(endpoint)
      .delete('/api/materials/' + materialID + '/remove')
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
  }); // Remove Material (non existant)


  describe('Remove Material (bad parameter)', function () {
    it('should fail to remove a material with bad parameter', function (done) {
      var materialID = 'BadParameter';
      request(endpoint)
      .delete('/api/materials/' + materialID + '/remove')
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
  }); // Remove Material (bad parameter)


  describe('Remove Material (no permission)', function () {
    it('should fail to remove a material - user not administrator', function (done) {
      request(endpoint)
      .delete('/api/materials/' + testMaterialID + '/remove')
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
  }); // Remove Material (no permission)


});