var express = require('express');
var router = express.Router();
var cors = require('cors');
var request = require('request');
var config = require('../config');

/* GET home page. */
router.get('/', function (req, res) {
	res.render('layout');
});

router.post('/', function (req, res) {

	var term = req.param('term', 'restaurant');  // second parameter is default
	var radius = req.param('radius', '100');
	var lat = req.param('lat', null);
	var lng = req.param('lng', null);
	var offset = req.param('offset', '0');

	var yelp = require("yelp").createClient({
		consumer_key: config.yelp.consumer_key, 
		consumer_secret: config.yelp.consumer_secret,
		token: config.yelp.token,
		token_secret: config.yelp.token_secret
	});

	yelp.search({
		term: term,
		radius_filter: radius,
		ll: lat + ',' + lng,
		offset: offset
	},
	function (error, data) {
		var businessesArr = [];
		if (data && data.businesses) {
			for (var i = 0; i < data.businesses.length; i++) {
				if (data.businesses[i].is_closed === false) {
					var categories = [];
					for (var j = 0; j < data.businesses[i].categories.length; j++) {
						categories.push(data.businesses[i].categories[j][0]);
					}
					businessesArr.push({
						name: data.businesses[i].name,
						image_url: data.businesses[i].image_url ? data.businesses[i].image_url.replace( /http:\/\//g, 'https://' ) : 'images/no-photo.jpg',
						rating_image_url: data.businesses[i].rating_img_url_large.replace( /http:\/\//g, 'https://' ),
						categories: categories,
						distance: data.businesses[i].distance < 400 ? (data.businesses[i].distance / 100).toFixed(1) + ' blocks' : (data.businesses[i].distance / 1609.34).toFixed(1) + ' miles',
						latLng: [data.businesses[i].location.coordinate.latitude, data.businesses[i].location.coordinate.longitude],
						address: data.businesses[i].location.address[0],
						city: data.businesses[i].location.city,
						state: data.businesses[i].location.state_code,
						zip_code: data.businesses[i].location.postal_code,
						phone: data.businesses[i].display_phone,
					});
				}
			}
			res.send(businessesArr);
		} else {
			console.log(error);
		}
	});

});

router.post('/text', cors(), function (req, res) {
	var number = parseInt(req.param('number'));
	var message = req.param('message');
	request.post('http://textbelt.com/text', {
		form: req.body
	}, 
	function (error, response, body) {
		if (!error && response.statusCode == 200) {
    		res.send(body);
		}
	});
});

module.exports = router;


