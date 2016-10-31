var common = require('../utils/testHelper');


describe('Shortlist -', function () {
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
  var BarbraStreisand = Math.floor((Math.random() * 999) + 1000);

  // id of test shortlist
  var testShortlistID

  // dummy shortlist owned by another user for testing permissions
  var dummyShortlistID


  describe('Add', function () {
    it('should add a new \'artists\' shortlist for the current user', function (done) {
      request(endpoint)
      .post('/api/shortlist/add')
      .set('authorization', 'Bearer ' + token)
      .send({
        'TypeID': 1,
        'Name': 'Name' + BarbraStreisand,
        'Description': 'Description' + BarbraStreisand
      })
      .expect('Content-Type', /json/)
      .expect(201)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.ID).toBeA('number');
        expect(res.body.Message).toEqual('Success');
        testShortlistID = res.body.ID;
        done();

        // the 'view' test will verify the shortlist was created correctly
        /*
        // check the new list was created correctly
        testShortlistID = res.body.ID;
        request(endpoint)
        .get('/api/shortlist/' + testShortlistID + '/view')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.ID).toEqual(testShortlistID);
          expect(res.body.TypeID).toEqual(1);
          expect(res.body.Name).toEqual('Name' + BarbraStreisand);
          expect(res.body.Description).toEqual('Description' + BarbraStreisand);
          expect(res.body.items).toExist();
          done();
        });
        */
      });
    });
  }); // Add


  describe('Add (bad argument)', function () {
    it('should fail to add a new \'artists\' shortlist for the current user', function (done) {
      request(endpoint)
      .post('/api/shortlist/add')
      .set('authorization', 'Bearer ' + token)
      .send({
        'TypeID': 'x',
        'Name': 'Name' + BarbraStreisand,
        'Description': 'Description' + BarbraStreisand
      })
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('Valid');
        done();
      });
    });
  }); // Add with bad argument


  // view will target the previously added shortlist - also verifying that 'add' created the shortlist correctly
  describe('View', function (){
    it('should view an existing shortlist (and check the shortlist was created correctly)', function (done) {
      request(endpoint)
      .get('/api/shortlist/' + testShortlistID + '/view')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res){
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.ID).toEqual(testShortlistID);
        expect(res.body.TypeID).toEqual(1);
        expect(res.body.Name).toEqual('Name' + BarbraStreisand);
        expect(res.body.Description).toEqual('Description' + BarbraStreisand);
        expect(res.body.Items).toExist();
        done();
      });
    });
  }); // View


  describe('View (non existant)', function (){
    it('should fail to find a non existant shortlist', function (done) {
      request(endpoint)
      .get('/api/shortlist/99999999/view')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(404)
      .end(function (err, res){
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('not found');
        done();
      });
    });
  }); // View (non existant)


  describe('View (bad argument)', function (){
    it('should fail to find a shortlist with bad argument', function (done) {
      request(endpoint)
      .get('/api/shortlist/x/view')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res){
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toContain('Invalid');
        done();
      });
    });
  }); // View (bad argument)


  describe('Archive', function () {
    it('should archive a shortlist', function (done) {
      request(endpoint)
      .put('/api/shortlist/' + testShortlistID + '/archive')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Success');

        // check the list was archived
        db('Shortlists').first('Archived').where({ 'ID': testShortlistID })
        .asCallback(function (err, shortlist){
          if(err) throw(err);
          expect(shortlist.Archived).toEqual(1);
          done();
        });
      });
    });
  }); // Archive


  describe('Archive (non existant)', function () {
    it('should fail to archive a non existant shortlist', function (done) {
      request(endpoint)
      .put('/api/shortlist/99999999/archive')
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
  }); // Archive (non existant)


  describe('Archive (bad argument)', function () {
    it('should fail to archive a shortlist with bad argument', function (done) {
      request(endpoint)
      .put('/api/shortlist/x/archive')
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
  }); // Archive (bad argument)


  describe('Archive (no permission)', function () {
    it('should fail to archive a shortlist owned by another user', function (done) {
      // create a dummy list owned by someone else
      db('Shortlists').insert({ 'ProfileID': 999999, 'Name': 'Dummy', 'Description': 'Dummy', 'TypeID': 2 })
      .asCallback(function (err, shortlist){
        if(err) throw(err);
        dummyShortlistID = shortlist[0];
        request(endpoint)
        .put('/api/shortlist/' + dummyShortlistID + '/archive')
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
  }); // Archive (no permission)


  describe('Add Items', function () {
    it('should add items to an existing shortlist', function (done) {
      // fetch a few artists to add
      db('Artists').select('ID').orderBy('ID', 'ASC').offset(0).limit(3)
      .asCallback(function (err, artists){
        if(err) throw(err);
        var artists = Object.keys(artists).map(function(k) { return artists[k].ID });
        request(endpoint)
        .post('/api/shortlist/' + testShortlistID + '/add')
        .set('authorization', 'Bearer ' + token)
        .send({ 'Artists': artists })
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toEqual('Success');
          expect(res.body.Artists).toEqual(3);

          // check the artists were added to the list
          db('ShortlistArtists').select('ArtistID').where({ 'ShortlistID': testShortlistID })
          .asCallback(function (err, shortlistArtists){
            if(err) throw(err);
            var shortlistArtists = Object.keys(shortlistArtists).map(function(k) { return shortlistArtists[k].ArtistID });
            // we should end up with the same array of artists that we passed to 'add'
            expect(shortlistArtists).toEqual(artists);
            done();
          });
        });
      });
    });
  }); // Add Items


  describe('Add Items (non existant list)', function () {
    it('should fail to add items to a non existant shortlist', function (done) {
      // fetch a few artists to add
      db('Artists').select('ID').orderBy('ID', 'ASC').offset(0).limit(3)
      .asCallback(function (err, artists){
        if(err) throw(err);
        var artists = Object.keys(artists).map(function(k) { return artists[k].ID });
        request(endpoint)
        .post('/api/shortlist/99999999/add')
        .set('authorization', 'Bearer ' + token)
        .send({ 'Artists': artists })
        .expect('Content-Type', /json/)
        .expect(404)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toEqual('Not Found');
          done();
        });
      });
    });
  }); // Add Items (non existant list)


  describe('Add Items (bad list argument)', function () {
    it('should fail to add items to a shortlist with bad argument', function (done) {
      // fetch a few artists to add
      db('Artists').select('ID').orderBy('ID', 'ASC').offset(0).limit(3)
      .asCallback(function (err, artists){
        if(err) throw(err);
        var artists = Object.keys(artists).map(function(k) { return artists[k].ID });
        request(endpoint)
        .post('/api/shortlist/x/add')
        .set('authorization', 'Bearer ' + token)
        .send({ 'Artists': artists })
        .expect('Content-Type', /json/)
        .expect(400)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.Message).toContain('Invalid');
          done();
        });
      });
    });
  }); // Add Items (bad list argument)


  describe('Add Items (no permission)', function () {
    it('should fail to add items to a shortlist owned by another user', function (done) {
      // fetch a few artists to add
      db('Artists').select('ID').orderBy('ID', 'ASC').offset(0).limit(3)
      .asCallback(function (err, artists){
        if(err) throw(err);
        var artists = Object.keys(artists).map(function(k) { return artists[k].ID });
        request(endpoint)
        .post('/api/shortlist/' + dummyShortlistID + '/add')
        .set('authorization', 'Bearer ' + token)
        .send({ 'Artists': artists })
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
  }); // Add Items (no permission)


  describe('List Active Shortlists', function () {
    it('should list the user\'s active shortlists', function (done) {
      // unarchive the test shortlist
      db('Shortlists').update({ 'Archived': 0 }).where({ 'ID': testShortlistID })
      .then(function(shortlist){
        request(endpoint)
        .get('/api/shortlist/')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body[0].ID).toBeA('number');
          expect(res.body[0].TypeID).toBeA('number');
          expect(res.body[0].Type).toBeA('string');
          expect(res.body[0].Name).toBeA('string');
          expect(res.body[0].Description).toBeA('string');
          done();
        });
      });
    });
  }); // List Active Shortlists


  describe('List Shortlist Types', function () {
    it('should list the shortlist types', function (done) {
      request(endpoint)
      .get('/api/shortlist/types')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body[0].ID).toEqual(1);
        expect(res.body[0].Type).toEqual('Artist');
        expect(res.body[1].ID).toEqual(2);
        expect(res.body[1].Type).toEqual('Artwork');
        done();
      });
    });
  }); // List Shortlist Types


}); // Shortlist
