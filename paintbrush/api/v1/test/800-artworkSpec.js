var common = require('../utils/testHelper');
var uuid = require('node-uuid');
var fs = require('fs');


describe('Artwork -', function () {
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
  var ChristopherWalken = Math.floor((Math.random() * 999) + 1000);
  var testArtworkID


  describe('Like Artwork', function () {
    it('should record liking an artwork', function (done) {
      var artworkID = 2;
      // fetch the current likes for artwork
      db('Artworks').select('Likes').where({ ID: artworkID })
      .asCallback(function (err, likes){
        if(err) throw(err);
        var totalLikes = likes[0].Likes;

        // like the artwork
        request(endpoint)
        .get('/api/artwork/' + artworkID + '/action/like')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toEqual('Success');

          // check the Artworks table likes have incremented
          db('Artworks').select('Likes').where({ ID: artworkID })
          .asCallback(function (err, likes){
            if(err) throw(err);
            expect(likes[0].Likes).toEqual(++totalLikes);

            // check the ArtworkLikes table has been updated
            db('ArtworkLikes').count('ID as Likes').where('ArtworkID', '=', artworkID)
            .asCallback(function (err, likes){
              if(err) throw(err);
              expect(likes[0].Likes).toEqual(totalLikes);
              done();
            });
          });
        });
      });
    });
  }); // Like Artwork


  describe('Like Artwork (non existant / bad parameter)', function () {
    it('should fail to like a non existant artwork', function (done) {
      var artworkID = 999999;
      // like the artwork
      request(endpoint)
      .get('/api/artwork/' + artworkID + '/action/like')
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
  }); // Like Artwork (non existant / bad parameter)

  //
  //describe('Viewed Artwork', function () {
  //  it('should record viewing an artwork', function (done) {
  //    var artworkID = 2;
  //    // fetch the current views for artwork
  //    db('Artworks').select('Views').where({ ID: artworkID })
  //    .asCallback(function (err, views){
  //      if(err) throw(err);
  //      var totalViews = views[0].Views;
  //
  //      // record the artwork view
  //      request(endpoint)
  //      .get('/api/artwork/' + artworkID + '/action/viewed')
  //      .set('authorization', 'Bearer ' + token)
  //      .expect('Content-Type', /json/)
  //      .expect(200)
  //      .end(function (err, res) {
  //        if(err) throw(err);
  //        expect(res.body).toExist();
  //        expect(res.body.Message).toEqual('Success');
  //
  //        // check the Artworks table views have incremented
  //        db('Artworks').select('Views').where({ ID: artworkID })
  //        .asCallback(function (err, views){
  //          if(err) throw(err);
  //          expect(views[0].Views).toEqual(++totalViews);
  //
  //          // check the ArtworkViews table has been updated
  //          db('ArtworkViews').count('ID as Views').where('ArtworkID', '=', artworkID)
  //          .asCallback(function (err, views){
  //            if(err) throw(err);
  //            expect(views[0].Views).toEqual(totalViews);
  //            done();
  //          });
  //        });
  //      });
  //    });
  //  });
  //}); // Viewed Artwork
  //
  //
  //describe('Viewed Artwork (non existant / bad parameter)', function () {
  //  it('should fail to record viewing a non existant artwork', function (done) {
  //    var artworkID = 'BadParameter';
  //    // view the artwork
  //    request(endpoint)
  //    .get('/api/artwork/' + artworkID + '/action/viewed')
  //    .set('authorization', 'Bearer ' + token)
  //    .expect('Content-Type', /json/)
  //    .expect(404)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.Message).toContain('not found');
  //      done();
  //    });
  //  });
  //}); // Viewed Artwork (non existant / bad parameter)


  describe('Remove Artwork', function () {
    it('should remove an artwork from the system', function (done) {
      var artworkID = 3;
      request(endpoint)
      .delete('/api/artwork/' + artworkID + '/remove')
      .set('authorization', 'Bearer ' + token)
      .expect(204)
      .end(function (err, res) {
        if(err) throw(err);
        // we seem to be receiving {} for body - instead of null
        // from artwork.js : return res.status(204).send()
        //expect(res.body).toNotExist();
        expect(res.body).toEqual({});
        done();
      });
    });
  }); // Remove Artwork


  describe('Remove Artwork (non existant)', function () {
    it('should fail to remove a non existant artwork', function (done) {
      var artworkID = 999999;
      request(endpoint)
      .delete('/api/artwork/' + artworkID + '/remove')
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
  }); // Remove Artwork (non existant)


  describe('Remove Artwork (bad parameter)', function () {
    it('should fail to remove an artwork with bad parameter', function (done) {
      var artworkID = 'BadParameter';
      request(endpoint)
      .delete('/api/artwork/' + artworkID + '/remove')
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
  }); // Remove Artwork (bad parameter)


  describe('View Artwork', function (){
    it('should return the requested artwork details', function (done) {
      var artworkID = 2;
      request(endpoint)
      .get('/api/artwork/' + artworkID)
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Name).toBeA('string');
        expect(res.body.Description).toBeA('string');
        expect(res.body.ImageURI).toBeA('string');
        expect(res.body.WidthMM).toBeA('number');
        expect(res.body.HeightMM).toBeA('number');
        expect(res.body.DepthMM).toBeA('number');
        expect(res.body.LimitedEdition).toBeA('boolean');
        expect(res.body.Liked).toBeA('boolean');
        done();
      });
    });
  }); // View Artwork


  describe('View Artwork (non existant / bad parameter)', function () {
    it('should fail to return non existant artwork details', function (done) {
      var artworkID = 'BadParameter';
      request(endpoint)
      .get('/api/artwork/' + artworkID)
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
  }); // View Artwork (non existant / bad parameter)

  //
  //describe('Add Artwork', function () {
  //  it('should add an artwork', function (done) {
  //    this.timeout(10000);
  //    request(endpoint)
  //    .post('/api/artwork/add')
  //    .set('authorization', 'Bearer ' + token)
  //    .send({
  //      'Name': 'Artwork Name' + ChristopherWalken,
  //      'Description': 'Artwork Description' + ChristopherWalken,
  //      'ImageURI': 'https://members.artretailnetwork.com/img/logo-new-40-t.png',//'img/arn-logo-t.png',
  //      'ArtworkTypeID': 2,
  //      'WidthMM': 50,
  //      'HeightMM': 75,
  //      'DepthMM': 5,
  //      'Materials': [ 2, 5 ],
  //      'PricebandID': 2,
  //      'Tags': [ 'Tag ' + ChristopherWalken ]
  //    })
  //    .expect('Content-Type', /json/)
  //    .expect(201)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.ID).toBeA('number');
  //      expect(res.body.Message).toBe('Success');
  //      testArtworkID = res.body.ID;
  //
  //      // check record was created correctly
  //      db('Artworks').where({ ID: testArtworkID })
  //      .asCallback(function (err, created){
  //        if(err) throw(err);
  //        expect(created[0].Name).toBe('Artwork Name' + ChristopherWalken);
  //        expect(created[0].Description).toBe('Artwork Description' + ChristopherWalken);
  //        done();
  //      });
  //    });
  //  });
  //}); // Add Artwork


  describe('Add Artwork (missing required parameter)', function () {
    it('should fail to add an artwork with missing required parameter', function (done) {
      request(endpoint)
      .post('/api/artwork/add')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Name': 'Artwork Name' + (ChristopherWalken + 1),
        'Description': 'Artwork Description' + (ChristopherWalken + 1),
        'ImageURI': 'img/arn-logo-t.png',
        // 'ArtworkTypeID': 2,  -- required
        'WidthMM': 50,
        'HeightMM': 75,
        'DepthMM': 5,
        'Materials': [ 2, 5 ],
        'PricebandID': 2,
        'Tags': [ 'Tag ' + (ChristopherWalken + 1) ]
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('required');
        done();
      });
    });
  }); // Add Artwork (missing required parameter)

  //
  //describe('Update Artwork', function () {
  //  it('should update an artwork', function (done) {
  //    request(endpoint)
  //    .put('/api/artwork/' + testArtworkID + '/update')
  //    .set('authorization', 'Bearer ' + token)
  //    .send({
  //      'Name': 'Updated Name' + ChristopherWalken,
  //      'Description': 'Updated Description' + ChristopherWalken,
  //      'WidthMM': 50,
  //      'Tags': [ 'Updated Tag ' + ChristopherWalken, 'Autocomplete test' ]
  //    })
  //    .expect('Content-Type', /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.Message).toBe('Success');
  //
  //      // check record was updated correctly
  //      db('Artworks').where({ ID: testArtworkID })
  //      .asCallback(function (err, updated){
  //        if(err) throw(err);
  //        expect(updated[0].Name).toBe('Updated Name' + ChristopherWalken);
  //        expect(updated[0].Description).toBe('Updated Description' + ChristopherWalken);
  //        done();
  //      });
  //    });
  //  });
  //}); // Update Artwork
  //
  //
  //describe('Upload Artwork', function () {
  //  it('should upload an artwork image', function (done) {
  //    var boundary = uuid.v4();
  //    var filename = 'uploadTest' + ChristopherWalken + '.png';
  //    var testImg = require('path').resolve(__dirname + '/data/arn-logo-t.png');
  //    request(endpoint)
  //    .post('/api/artwork/upload?qqfile=' + filename)
  //    .set('authorization', 'Bearer ' + token)
  //    .set('Content-Type', 'multipart/form-data; boundary=' + boundary)
  //    .send('--' + boundary + '\r\n')
  //    .send('Content-Disposition: form-data; name="uploadImage"; filename="' + filename + '"\r\n')
  //    .send('Content-Type: image/png\r\n')
  //    .send('\r\n')
  //    .send(fs.readFileSync(testImg))
  //    .send('\r\n--' + boundary + '--')
  //    .expect('Content-Type', /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.Location).toBe('/uploads/');
  //      expect(res.body.Filename).toBeA('string');
  //      expect(res.body.OriginalFilename).toBe(filename);
  //      done();
  //    });
  //  });
  //}); // Upload Artwork


describe('List Artwork Pricebands', function () {
    it('should list all artwork pricebands', function (done) {
      request(endpoint)
      .get('/api/artwork/pricebands')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Min).toBeA('number');
          expect(res.body[i].Max).toBeA('number');
        }
        done();
      });
    });
  }); // List Artwork Pricebands


  describe('List Artwork Unit Dimensions', function () {
    it('should list all artwork unit dimensions', function (done) {
      request(endpoint)
      .get('/api/artwork/dimension-units')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Name).toBeA('string');
          expect(res.body[i].Symbol).toBeA('string');
          expect(res.body[i].Ratio_MM).toBeA('number');
        }
        done();
      });
    });
  }); // List Artwork Unit Dimensions

  //
  //describe('List Artwork Tags Matching Snippet', function () {
  //  it('should list all artwork tags beginning with the specified snippet', function (done) {
  //    // search for the test 'Autocomplete test' tag inserted previously
  //    request(endpoint)
  //    .get('/api/artwork/tag/autocomplete/auto')
  //    .set('authorization', 'Bearer ' + token)
  //    .expect('Content-Type', /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.length).toBe(1);
  //      expect(res.body[0].Tag).toBe('Autocomplete test');
  //      done();
  //    });
  //  });
  //}); // List Artwork Tags Matching Snippet


  describe('List Artwork Statuses', function () {
    it('should list all artwork statuses', function (done) {
      request(endpoint)
      .get('/api/artwork/statuses')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Status).toBeA('string');
        }
        done();
      });
    });
  }); // List Artwork Statuses


  describe('List Artwork Styles', function () {
    it('should list all artwork styles', function (done) {
      request(endpoint)
      .get('/api/artwork/styles')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Style).toBeA('string');
        }
        done();
      });
    });
  }); // List Artwork Styles


  describe('List Artwork Subjects', function () {
    it('should list all artwork subjects', function (done) {
      request(endpoint)
      .get('/api/artwork/subjects')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toBeGreaterThan(1);
        for(i = 0; i < res.body.length; i++){
          expect(res.body[i].ID).toBeA('number');
          expect(res.body[i].Subject).toBeA('string');
        }
        done();
      });
    });
  }); // List Artwork Subjects


  describe('List Artwork Time Spent Options', function () {
    it('should list all artwork time spent options', function (done) {
      request(endpoint)
      .get('/api/artwork/time-spent')
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
  }); // List Artwork Time Spent Options


  describe('List Artwork Types', function () {
    it('should list all artwork types', function (done) {
      request(endpoint)
      .get('/api/artwork/types')
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
  }); // List Artwork Types


  describe('Search Artwork By Profile', function () {
    it('should search artwork associated with a single profile', function (done) {
      request(endpoint)
      .post('/api/artwork/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'ArtistProfileID': 4 }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBeMoreThan(0);
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ID).toBeA('number');
          expect(res.body.Data[i].ArtistProfileID).toBeA('number');
          expect(res.body.Data[i].OwnerProfileID).toBeA('number');
          expect(res.body.Data[i].ArtworkTypeID).toBeA('number');
          expect(res.body.Data[i].Name).toBeA('string');
          expect(res.body.Data[i].Description).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Pagination.PageSize).toBeA('number');
          expect(res.body.Pagination.PageNumber).toBeA('number');
          expect(res.body.Pagination.TotalResults).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artwork By Profile


  describe('Search Artwork By Profile (page out of bounds)', function () {
    it('should find no results for out of bounds page number', function (done) {
      request(endpoint)
      .post('/api/artwork/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 5500 },
        'Filters': { 'ArtistProfileID': 4 }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toNotExist();
        done();
      });
    });
  }); // Search Artwork By Profile (page out of bounds)


}); // Artwork