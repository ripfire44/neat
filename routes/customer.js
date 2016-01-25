var express = require('express');
var router = express.Router();
var Db = require('tingodb')().Db;
var path = require('path');
var bodyParser = require('body-parser');

// Normally, you should construct a type of data access layer or repository pattern rather than coding the access from the route

var Customer = require('../models/Customer');

var db = new Db('./data', {});
var collection = db.collection('customer');

var jsonParser = bodyParser.json();

/* GET */
router.get('/', function(req, res) {
	collection.find().toArray(function(err, docs) {
		if (!docs) {
			res.json({
				data: []
			});
		} else {
			res.json({
				data: docs
			});
		}
	});
});

/* GET New Customer Factory */
router.get('/new', function(req, res) {
	res.json(new Customer());
});

/* POST */
router.post('/', jsonParser, function(req, res) {
	var customer = req.body;
	if (customer) {
		collection.insert(customer, {
			w: 1
		}, function(err, item) {
			if (!err) {
				res.json(item);
			}

		})
	}
});


module.exports = router;