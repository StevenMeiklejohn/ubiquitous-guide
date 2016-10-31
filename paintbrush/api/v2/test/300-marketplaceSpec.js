var common = require('../utils/testHelper');


describe('Marketplace -', function () {
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


  describe('List Recommended Artists', function () {
    it('should list the top shortlisted artists (10 max)', function (done) {
      request(endpoint)
      .get('/api/marketplace/recommended')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body[0].ArtistID).toBeA('number');
        expect(res.body[0].ProfileID).toBeA('number');
        expect(res.body[0].Name).toBeA('string');
        expect(res.body[0].ImageURI).toBeA('string');
        expect(res.body[0].ArtworkID).toBeA('number');
        expect(res.body[0].ArtworkTitle).toBeA('string');
        expect(res.body[0].ProfileImageURI).toBeA('string');
        expect(res.body[0].TotalArtwork).toBeA('number');
        expect(res.body[0].TotalViews).toBeA('number');
        expect(res.body[0].TotalLikes).toBeA('number');
        expect(res.body[0].TotalShortlisted).toBeA('number');
        done();
      });
    });
  }); // List Recommended Artists


describe('Search Artists By Name (text)', function () {
    it('should list artists containing the text \'Artist\' in the name field', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Text': 'Artist' }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBeMoreThan(1);
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ArtistID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtworkID).toBeA('number');
          expect(res.body.Data[i].ArtworkTitle).toBeA('string');
          expect(res.body.Data[i].ProfileImageURI).toBeA('string');
          expect(res.body.Data[i].Artworks).toBeA('number');
          expect(res.body.Data[i].Views).toBeA('number');
          expect(res.body.Data[i].Likes).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artists By Name


  describe('Search Artists By Name (non existant)', function () {
    it('should find no artists containing the search text', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 'Text': '_Non_Existant_' }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists By Name (non existant)


  describe('Search Artists + styles', function () {
    it('should filter previous results by styles', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toExist();
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ArtistID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtworkID).toBeA('number');
          expect(res.body.Data[i].ArtworkTitle).toBeA('string');
          expect(res.body.Data[i].ProfileImageURI).toBeA('string');
          expect(res.body.Data[i].Artworks).toBeA('number');
          expect(res.body.Data[i].Views).toBeA('number');
          expect(res.body.Data[i].Likes).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artists + styles


  describe('Search Artists + bad styles filter', function () {
    it('should fail to search with bad styles filter', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': 'BadFilter'
        }
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body.Message).toEqual('Style filter: an array of styles is required');
        done();
      });
    });
  }); // Search Artists + bad styles filter


  describe('Search Artists + styles (non existant)', function () {
    it('should find no artists for the requested styles', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 999, 9999 ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists + styles (non existant)


  describe('Search Artists + materials', function () {
    it('should filter previous results by materials', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': {
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data).toExist();
        expect(res.body.Data.length).toExist();
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ArtistID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtworkID).toBeA('number');
          expect(res.body.Data[i].ArtworkTitle).toBeA('string');
          expect(res.body.Data[i].ProfileImageURI).toBeA('string');
          expect(res.body.Data[i].Artworks).toBeA('number');
          expect(res.body.Data[i].Views).toBeA('number');
          expect(res.body.Data[i].Likes).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artists + materials


  describe('Search Artists + bad materials filter', function () {
    it('should fail to search with bad materials filter', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Material': 'BadFilter'
        }
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body.Message).toEqual('Material filter: an array of materials is required');
        done();
      });
    });
  }); // Search Artists + bad materials filter


  describe('Search Artists + materials (non existant)', function () {
    it('should find no artists for the requested materials', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': {
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [ 999, 9999 ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists + materials (non existant)


  describe('Search Artists + pricebands', function () {
    it('should filter previous results by pricebands', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': {
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data).toExist();
        expect(res.body.Data.length).toExist();
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ArtistID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtworkID).toBeA('number');
          expect(res.body.Data[i].ArtworkTitle).toBeA('string');
          expect(res.body.Data[i].ProfileImageURI).toBeA('string');
          expect(res.body.Data[i].Artworks).toBeA('number');
          expect(res.body.Data[i].Views).toBeA('number');
          expect(res.body.Data[i].Likes).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artists + pricebands


  describe('Search Artists + bad pricebands filter', function () {
    it('should fail to search with bad pricebands filter', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': 'BadFilter'
        }
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body.Message).toEqual('Price filter: an array of price bands is required');
        done();
      });
    });
  }); // Search Artists + bad pricebands filter


  describe('Search Artists + pricebands (non existant)', function () {
    it('should find no artists for the requested price bands', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 999, 9999 ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists + pricebands (non existant)


  describe('Search Artists + subjects', function () {
    it('should filter previous results by subjects', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': {
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ],
          'Subject': [ 3, 4 ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data).toExist();
        expect(res.body.Data.length).toExist();
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ArtistID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtworkID).toBeA('number');
          expect(res.body.Data[i].ArtworkTitle).toBeA('string');
          expect(res.body.Data[i].ProfileImageURI).toBeA('string');
          expect(res.body.Data[i].Artworks).toBeA('number');
          expect(res.body.Data[i].Views).toBeA('number');
          expect(res.body.Data[i].Likes).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artists + subjects


  describe('Search Artists + bad subjects filter', function () {
    it('should fail to search with bad subjects filter', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ],
          'Subject': 'BadFilter'
        }
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body.Message).toEqual('Subject filter: an array of subjects is required');
        done();
      });
    });
  }); // Search Artists + bad subjects filter


  describe('Search Artists + subjects (non existant)', function () {
    it('should find no artists for the requested subjects', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ],
          'Subject': [ 999, 9999 ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists + subjects (non existant)


  describe('Search Artists + colours', function () {
    it('should filter previous results by colours', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': {
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ],
          'Subject': [ 3, 4 ],
          'Colour': [
            { R: 255, G: 128, B: 0 },
            { R: 128, G: 128, G: 128 }
          ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data).toExist();
        expect(res.body.Data.length).toExist();
        for(i = 0; i < res.body.Data.length; i++){
          expect(res.body.Data[i].ArtistID).toBeA('number');
          expect(res.body.Data[i].ProfileID).toBeA('number');
          expect(res.body.Data[i].ArtistName).toBeA('string');
          expect(res.body.Data[i].ImageURI).toBeA('string');
          expect(res.body.Data[i].ArtworkID).toBeA('number');
          expect(res.body.Data[i].ArtworkTitle).toBeA('string');
          expect(res.body.Data[i].ProfileImageURI).toBeA('string');
          expect(res.body.Data[i].Artworks).toBeA('number');
          expect(res.body.Data[i].Views).toBeA('number');
          expect(res.body.Data[i].Likes).toBeA('number');
        }
        done();
      });
    });
  }); // Search Artists + colours


  describe('Search Artists + bad colours filter', function () {
    it('should fail to search with bad colours filter', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ],
          'Subject': [ 3, 4 ],
          'Colour': 'BadFilter'
        }
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body.Message).toEqual('Colour filter: an array of colours is required');
        done();
      });
    });
  }); // Search Artists + bad colours filter


  describe('Search Artists + colours (non existant)', function () {
    it('should find no artists for the requested colours', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 0 },
        'Filters': { 
          'Text': 'Artist',
          'Style': [ 1, 5, 'X' ],
          'Material': [3, 'X', 14],
          'Price': [ 2, 'X', 'Y', 'Z' ],
          'Subject': [ 3, 4 ],
          'Colour': [
            { R: 32, G: 64, B: 128 },
            { R: 64, G: 128, G: 0 }
          ]
        }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists + colours (non existant)


  describe('Search Artists (page out of bounds)', function () {
    it('should find no results for out of bounds page number', function (done) {
      request(endpoint)
      .post('/api/marketplace/search')
      .set('authorization', 'Bearer ' + token)
      .send({
        'Pagination': { 'PageSize': 10, 'PageNumber': 99 },
        'Filters': { 'Text': 'Artist' }
      })
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Data.length).toBe(0);
        done();
      });
    });
  }); // Search Artists (page out of bounds)


}); // Marketplace
