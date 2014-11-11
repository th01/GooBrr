
var config = {};

config.yelp = {};


config.yelp.consumer_key = process.env.YELP_CONSUMER_KEY;
config.yelp.consumer_secret = process.env.YELP_CONSUMER_SECRET;
config.yelp.token = process.env.YELP_TOKEN;
config.yelp.token_secret = process.env.YELP_TOKEN_SECRET;

module.exports = config;

