'use strict';

// simple express server
var express = require('express');
var app = express();
var path = require('path');

var publicDir = path.join(__dirname, 'public');

// Setup REST API
var routeCustomer = require(path.join(__dirname, 'routes/customer'));
app.use('/api/customer', routeCustomer);

// Setup public dir
app.use(express.static(publicDir));
// Default document for SPA
app.all('/*', function(req, res) {
	res.sendFile(path.join(publicDir, 'index.html'));
});


app.listen(process.env.PORT);