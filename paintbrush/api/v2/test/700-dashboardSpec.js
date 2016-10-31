var common = require('../utils/testHelper');


describe('Dashboard -', function () {
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


  // Views

  //
  //describe('List Artwork Views', function () {
  //  it('should list the user\'s total artwork views', function (done) {
  //    request(endpoint)
  //    .get('/api/dashboard/views/artwork')
  //    .set('authorization', 'Bearer ' + token)
  //    .expect('Content-Type', /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.Count).toBeA('number');
  //      expect(res.body.Count).toEqual(6);
  //      done();
  //    });
  //  });
  //}); // List Artwork Views


  //describe('List Artwork Views Over Time - 10 days', function () {
  //  it('should list the user\'s total artwork views over the last 10 days', function (done) {
  //    request(endpoint)
  //    .get('/api/dashboard/views/artwork/day/10')
  //    .set('authorization', 'Bearer ' + token)
  //    .expect('Content-Type', /json/)
  //    .expect(200)
  //    .end(function (err, res) {
  //      if(err) throw(err);
  //      expect(res.body).toExist();
  //      expect(res.body.length).toEqual(10);
  //      expect(res.body[0]).toEqual(0);
  //      expect(res.body[1]).toEqual(0);
  //      expect(res.body[2]).toEqual(2);
  //      expect(res.body[8]).toEqual(0);
  //      expect(res.body[9]).toEqual(3);
  //      done();
  //    });
  //  });
  //}); // List Artwork Views Over Time - 10 days


  describe('List Artwork Views Over Time - 6 weeks', function () {
    it('should list the user\'s total artwork views over the last 6 weeks', function (done) {
      db.select(db.raw('COUNT(av.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('ArtworkViews AS av ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(av.created_at, \'%Y-%u\')'))
      .leftJoin('Artworks as aw', 'aw.ID', 'av.ArtworkID')
      .where('aw.ArtistProfileID', '=', testUser.ProfileID)
      .orWhereNull('av.ID')
      .groupBy('i.ID')
      .limit(6)
      .pluck(db.raw('total'))
      .then(function (views){
        views.reverse();
        request(endpoint)
        .get('/api/dashboard/views/artwork/week/6')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(6);
          expect(res.body[0]).toEqual(views[0]);
          expect(res.body[1]).toEqual(views[1]);
          expect(res.body[2]).toEqual(views[2]);
          expect(res.body[3]).toEqual(views[3]);
          expect(res.body[4]).toEqual(views[4]);
          expect(res.body[5]).toEqual(views[5]);
          done();
        });
      });
    });
  }); // List Artwork Views Over Time - 6 weeks


  describe('List Artwork Views Over Time - 3 months', function () {
    it('should list the user\'s total artwork views over the last 3 months', function (done) {
      db.select(db.raw('COUNT(av.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('ArtworkViews AS av ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(av.created_at, \'%Y-%m\')'))
      .leftJoin('Artworks as aw', 'aw.ID', 'av.ArtworkID')
      .where('aw.ArtistProfileID', '=', testUser.ProfileID)
      .orWhereNull('av.ID')
      .groupBy('i.ID')
      .limit(3)
      .pluck(db.raw('total'))
      .then(function (views){
        views.reverse();
        request(endpoint)
        .get('/api/dashboard/views/artwork/month/3')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(3);
          expect(res.body[0]).toEqual(views[0]);
          expect(res.body[1]).toEqual(views[1]);
          expect(res.body[2]).toEqual(views[2]);
          done();
        });
      });
    });
  }); // List Artwork Views Over Time - 3 months


  describe('List Artwork Views Over Time - bad interval', function () {
    it('should fail to list the user\'s artwork views with a bad interval', function (done) {
      request(endpoint)
      .get('/api/dashboard/views/artwork/aeon/1')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Interval must be one of day / week / month');
        done();
      });
    });
  }); // List Artwork Views Over Time - bad interval





  // Likes : results should differ from Views results


  describe('List Artwork Likes', function () {
    it('should list the user\'s total artwork likes', function (done) {
      request(endpoint)
      .get('/api/dashboard/likes/artwork')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Count).toBeA('number');
        expect(res.body.Count).toEqual(7);
        done();
      });
    });
  }); // List Artwork Likes


  describe('List Artwork Likes Over Time - 10 days', function () {
    it('should list the user\'s total artwork likes over the last 10 days', function (done) {
      request(endpoint)
      .get('/api/dashboard/likes/artwork/day/10')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toEqual(10);
        expect(res.body[0]).toEqual(0);
        expect(res.body[1]).toEqual(0);
        expect(res.body[2]).toEqual(3);
        expect(res.body[8]).toEqual(0);
        expect(res.body[9]).toEqual(2);
        done();
      });
    });
  }); // List Artwork Likes Over Time - 10 days


  describe('List Artwork Likes Over Time - 6 weeks', function () {
    it('should list the user\'s total artwork likes over the last 6 weeks', function (done) {
      db.select(db.raw('COUNT(al.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('ArtworkLikes AS al ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(al.created_at, \'%Y-%u\')'))
      .leftJoin('Artworks as aw', 'aw.ID', 'al.ArtworkID')
      .where('aw.ArtistProfileID', '=', testUser.ProfileID)
      .orWhereNull('al.ID')
      .groupBy('i.ID')
      .limit(6)
      .pluck(db.raw('total'))
      .then(function (likes){
        likes.reverse();
        request(endpoint)
        .get('/api/dashboard/likes/artwork/week/6')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(6);
          expect(res.body[0]).toEqual(likes[0]);
          expect(res.body[1]).toEqual(likes[1]);
          expect(res.body[2]).toEqual(likes[2]);
          expect(res.body[3]).toEqual(likes[3]);
          expect(res.body[4]).toEqual(likes[4]);
          expect(res.body[5]).toEqual(likes[5]);
          done();
        });
      });
    });
  }); // List Artwork Likes Over Time - 6 weeks


  describe('List Artwork Likes Over Time - 3 months', function () {
    it('should list the user\'s total artwork likes over the last 3 months', function (done) {
      db.select(db.raw('COUNT(al.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('ArtworkLikes AS al ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(al.created_at, \'%Y-%m\')'))
      .leftJoin('Artworks as aw', 'aw.ID', 'al.ArtworkID')
      .where('aw.ArtistProfileID', '=', testUser.ProfileID)
      .orWhereNull('al.ID')
      .groupBy('i.ID')
      .limit(3)
      .pluck(db.raw('total'))
      .then(function (likes){
        likes.reverse();
        request(endpoint)
        .get('/api/dashboard/likes/artwork/month/3')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(3);
          expect(res.body[0]).toEqual(likes[0]);
          expect(res.body[1]).toEqual(likes[1]);
          expect(res.body[2]).toEqual(likes[2]);
          done();
        });
      });
    });
  }); // List Artwork Likes Over Time - 3 months


  describe('List Artwork Likes Over Time - bad interval', function () {
    it('should fail to list the user\'s artwork likes with a bad interval', function (done) {
      request(endpoint)
      .get('/api/dashboard/likes/artwork/aeon/1')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Interval must be one of day / week / month');
        done();
      });
    });
  }); // List Artwork Likes Over Time - bad interval





  // Shortlisted


  describe('List Artwork Shortlisted', function () {
    it('should list the user\'s total shortlisted artwork', function (done) {
      request(endpoint)
      .get('/api/dashboard/shortlisted/artwork')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Count).toBeA('number');
        expect(res.body.Count).toEqual(6);
        done();
      });
    });
  }); // List Artwork Shortlisted


  describe('List Artwork Shortlisted Over Time - 10 days', function () {
    it('should list the user\'s total shortlisted artwork over the last 10 days', function (done) {
      request(endpoint)
      .get('/api/dashboard/shortlisted/artwork/day/10')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toEqual(10);
        expect(res.body[0]).toEqual(0);
        expect(res.body[1]).toEqual(0);
        expect(res.body[2]).toEqual(2);
        expect(res.body[8]).toEqual(0);
        expect(res.body[9]).toEqual(1);
        done();
      });
    });
  }); // List Artwork Shortlisted Over Time - 10 days


  describe('List Artwork Shortlisted Over Time - 6 weeks', function () {
    it('should list the user\'s total shortlisted artwork over the last 6 weeks', function (done) {
      db.select(db.raw('COUNT(sa.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('ShortlistArtworks AS sa ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(sa.created_at, \'%Y-%u\')'))
      .leftJoin('Artworks as aw', 'aw.ID', 'sa.ArtworkID')
      .where('aw.ArtistProfileID', '=', testUser.ProfileID)
      .orWhereNull('sa.ID')
      .groupBy('i.ID')
      .limit(6)
      .pluck(db.raw('total'))
      .then(function (shortlisted){
        shortlisted.reverse();
        request(endpoint)
        .get('/api/dashboard/shortlisted/artwork/week/6')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(6);
          expect(res.body[0]).toEqual(shortlisted[0]);
          expect(res.body[1]).toEqual(shortlisted[1]);
          expect(res.body[2]).toEqual(shortlisted[2]);
          expect(res.body[3]).toEqual(shortlisted[3]);
          expect(res.body[4]).toEqual(shortlisted[4]);
          expect(res.body[5]).toEqual(shortlisted[5]);
          done();
        });
      });
    });
  }); // List Artwork Shortlisted Over Time - 6 weeks


  describe('List Artwork Shortlisted Over Time - 3 months', function () {
    it('should list the user\'s total shortlisted artwork over the last 3 months', function (done) {
      db.select(db.raw('COUNT(sa.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('ShortlistArtworks AS sa ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(sa.created_at, \'%Y-%m\')'))
      .leftJoin('Artworks as aw', 'aw.ID', 'sa.ArtworkID')
      .where('aw.ArtistProfileID', '=', testUser.ProfileID)
      .orWhereNull('sa.ID')
      .groupBy('i.ID')
      .limit(3)
      .pluck(db.raw('total'))
      .then(function (shortlisted){
        shortlisted.reverse();
        request(endpoint)
        .get('/api/dashboard/shortlisted/artwork/month/3')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(3);
          expect(res.body[0]).toEqual(shortlisted[0]);
          expect(res.body[1]).toEqual(shortlisted[1]);
          expect(res.body[2]).toEqual(shortlisted[2]);
          done();
        });
      });
    });
  }); // List Artwork Shortlisted Over Time - 3 months


  describe('List Artwork Shortlisted Over Time - bad interval', function () {
    it('should fail to list the user\'s shortlisted artwork with a bad interval', function (done) {
      request(endpoint)
      .get('/api/dashboard/shortlisted/artwork/aeon/1')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Interval must be one of day / week / month');
        done();
      });
    });
  }); // List Artwork Shortlisted Over Time - bad interval





  // Follower Stats


  describe('List Followers', function () {
    it('should list the user\'s total followers', function (done) {
      request(endpoint)
      .get('/api/dashboard/followers')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Count).toBeA('number');
        expect(res.body.Count).toEqual(8);
        done();
      });
    });
  }); // List Followers


  describe('List Followers Over Time - 10 days', function () {
    it('should list the user\'s total followers over the last 10 days', function (done) {
      request(endpoint)
      .get('/api/dashboard/followers/day/10')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.length).toEqual(10);
        expect(res.body[0]).toEqual(0);
        expect(res.body[1]).toEqual(0);
        expect(res.body[2]).toEqual(2);
        expect(res.body[8]).toEqual(0);
        expect(res.body[9]).toEqual(4);
        done();
      });
    });
  }); // List Followers Over Time - 10 days


  describe('List Followers Over Time - 6 weeks', function () {
    it('should list the user\'s total followers over the last 6 weeks', function (done) {
      db.select(db.raw('COUNT(f.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) WEEK), \'%Y-%u\') = DATE_FORMAT(f.created_at, \'%Y-%u\')'))
      .where('f.FollowingProfileID', '=', testUser.ProfileID)
      .orWhereNull('f.ID')
      .groupBy('i.ID')
      .limit(6)
      .pluck(db.raw('total'))
      .then(function (followers){
        followers.reverse()
        request(endpoint)
        .get('/api/dashboard/followers/week/6')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(6);
          expect(res.body[0]).toEqual(followers[0]);
          expect(res.body[1]).toEqual(followers[1]);
          expect(res.body[2]).toEqual(followers[2]);
          expect(res.body[3]).toEqual(followers[3]);
          expect(res.body[4]).toEqual(followers[4]);
          expect(res.body[5]).toEqual(followers[5]);
          done();
        });
      });
    });
  }); // List Followers Over Time - 6 weeks


  describe('List Followers Over Time - 3 months', function () {
    it('should list the user\'s total followers over the last 3 months', function (done) {
      db.select(db.raw('COUNT(f.ID) AS total'))
      .from('Integers AS i')
      .leftJoin(db.raw('Followers AS f ON DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (i.ID - 1) MONTH), \'%Y-%m\') = DATE_FORMAT(f.created_at, \'%Y-%m\')'))
      .where('f.FollowingProfileID', '=', testUser.ProfileID)
      .orWhereNull('f.ID')
      .groupBy('i.ID')
      .limit(3)
      .pluck(db.raw('total'))
      .then(function (followers){
        followers.reverse();
        request(endpoint)
        .get('/api/dashboard/followers/month/3')
        .set('authorization', 'Bearer ' + token)
        .expect('Content-Type', /json/)
        .expect(200)
        .end(function (err, res) {
          if(err) throw(err);
          expect(res.body).toExist();
          expect(res.body.length).toEqual(3);
          expect(res.body[0]).toEqual(followers[0]);
          expect(res.body[1]).toEqual(followers[1]);
          expect(res.body[2]).toEqual(followers[2]);
          done();
        });
      });
    });
  }); // List Followers Over Time - 3 months


  describe('List Followers Over Time - bad interval', function () {
    it('should fail to list the user\'s followers with a bad interval', function (done) {
      request(endpoint)
      .get('/api/dashboard/followers/aeon/1')
      .set('authorization', 'Bearer ' + token)
      .expect('Content-Type', /json/)
      .expect(400)
      .end(function (err, res) {
        if(err) throw(err);
        expect(res.body).toExist();
        expect(res.body.Message).toEqual('Interval must be one of day / week / month');
        done();
      });
    });
  }); // List Followers Over Time - bad interval


}); // Dashboard