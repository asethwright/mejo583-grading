var request = require('request');
var expect = require('Chai').expect;
var datatypes = require('../datatypes.json');

datatypes.forEach((arrElement, callback) => {

  var postRequestMade = false;
  var getRequestMade = false;
  var requestsMade = 0;

  describe(`${arrElement.type} requests`, () => {

    it(`should create ${arrElement.type} via a POST request`, (done) => {
      var opts = {
        url: `http://localhost:8888/${arrElement.type}`,
        form: arrElement.params
      };

      request.post(opts, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        console.log(body);
        var json = JSON.parse(body)
        expect(json).to.be.an('object');
        postRequestMade = true;
        requestsMade++;
        done();
      });
    });

    it(`should fetch all ${arrElement.type} via a GET request`, (done) => {

      var check = function(d) {
        if (postRequestMade) d();
        else setTimeout(() => {
          check(d)
        }, 1000 );
      }

      before((d) => {
        check(d);
      });

      var opts = {
        url: `http://localhost:8888/${arrElement.type}`
      };
      request.get(opts, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        console.log(body);
        var json = JSON.parse(body)
        expect(json).to.be.an('array');
        expect(json).to.have.lengthOf(1);
        requestsMade++;
        done();
      });

    });

    it(`should fetch /${arrElement.type}/1 via a GET request`, (done) => {

      var check = function(d) {
        if (postRequestMade) d();
        else setTimeout(() => {
          check(d)
        }, 1000);
      }

      before((d) => {
        check(d);
      });

      var opts = {
        url: `http://localhost:8888/${arrElement.type}/1`
      };

      request.get(opts, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        console.log(body);
        var json = JSON.parse(body)
        expect(json).to.be.an('object');
        Object.keys(arrElement.params).forEach((key) => {
          expect(json).to.have.property(key);
          expect(json[key]).to.equal(arrElement.params[key])
        });
        getRequestMade = true;
        requestsMade++;
        done();
      });

    });

    it(`should update /${arrElement.type}/1 via a PUT request`, (done) => {

      var check = function(d) {
        if (postRequestMade && getRequestMade) d();
        else setTimeout(() => {
          check(d)
        }, 1000);
      }

      before((d) => {
        check(d);
      });

      var key = Object.keys(arrElement.params)[0];
      var obj = {};
      obj[key] = 'Seth';

      var opts = {
        url: `http://localhost:8888/${arrElement.type}/1`,
        form: obj
      };

      request.put(opts, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        console.log(body);
        var json = JSON.parse(body)
        expect(json).to.be.an('object');

        request.get(`http://localhost:8888/${arrElement.type}/1`, (err, res, body) => {
          expect(res.statusCode).to.equal(200);
          var json = JSON.parse(body)

          expect(json).to.be.an('object');
          expect(json[key]).to.equal('Seth');
          requestsMade++;
          done();
        })
      });

    });

    it(`should remove /${arrElement.type}/1 via a DELETE request`, (done) => {

      var check = function(d) {
        if (requestsMade >= 4) d();
        else setTimeout(() => {
          check(d)
        }, 1000);
      }

      before((d) => {
        check(d);
      });

      var opts = {
        url: `http://localhost:8888/${arrElement.type}/1`,
      };

      request.delete(opts, (err, res, body) => {
        expect(res.statusCode).to.equal(200);
        console.log(body);
        var json = JSON.parse(body)
        expect(json).to.be.an('object');

        request.get(`http://localhost:8888/${arrElement.type}`, (err, res, body) => {
          expect(res.statusCode).to.equal(200);
          var json = JSON.parse(body)
          expect(json).to.be.an('array');
          expect(json).to.have.lengthOf(0);
          done();
        });
      });

    });

  });

});
