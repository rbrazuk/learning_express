// BASE SETUP

var express = require('express');  // call express
var app = express();               // define our app using express
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://admin:admin@ds133241.mlab.com:33241/bears');

var Bear = require('./app/models/bear');

// configure app to use bodyParser()
// this will let us get the data from a POST

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;   // set our port

// ROUTES FOR OUR API

var router = express.Router();        // get instance of the express router

// middleware to use for all requests
router.use(function(req, res, next) {
  console.log('Something is happening');
  next();
})

// test route - GET http://localhost:8080/api

router.get('/', function(req, res) {
  res.json({message: 'hooray! welcome to our api!'});
});

// more routes will go here

router.route('/bears')
  .post(function(req, res) {
    var bear = new Bear();
    bear.name = req.body.name;

    bear.save(function(err) {
      if (err) {
        res.send(err);
      }
      res.json({message: 'Bear created!'});
    });
  })
  .get(function(req, res) {
    Bear.find(function(err, bears) {
      if (err) {
        res.send(err);
      }
      res.json(bears);
    });
  });

  router.route('/bears/:bear_id')
    .get(function(req, res) {
      Bear.findById(req.params.bear_id, function(err, bear) {
        if (err) {
          res.send(err);
        }
        res.json(bear);
      });
    })
    .put(function(req, res) {
      Bear.findById(req.params.bear_id, function(err, bear) {
        if (err) {
          res.send(err);
        }

        bear.name = req.body.name;

        bear.save(function(err) {
          if (err) {
            res.send(err);
          }
          res.json({message: 'Bear updated!'});
        });
      });
    })
    .delete(function(req, res) {
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });
// REGISTER ROUTES

app.use('/api', router);

// START THE SERVER

app.listen(port);
console.log('Magic happens on port ' + port);
