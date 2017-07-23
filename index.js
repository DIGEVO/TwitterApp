var Twitter = require('twit');
var request = require('request');
require('dotenv').config();

var twitter = new Twitter({
    bot_account: process.env.BOT_ACCOUNT,
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

// Stream of @mentions forbot_account
var stream = twitter.stream('statuses/filter', { track: process.env.BOT_ACCOUNT });

// Attempting connection to streaming API
stream.on('connect', function (response) {
    console.log("Opening Twitter streaming connection.")
});

// Connection opened
stream.on("connected", function (response) {
    console.log("Streaming...")
});

// The @mentions
stream.on('tweet', function (tweet) {
    try {
        handleTweet(tweet);
    } catch (err) {
        console.error('error: ', err);
        //console.log("Unexpected error handling tweet: ", tweet)
    }
});

function handleTweet(tweet) {
    // console.log(tweet);
    respondToTweet(tweet);
    //tweet.user.name, tweet.user.screen_name, tweet.user.
    //tweet.truncated
}

function respondToTweet(tweet) {
    //todo contar, status debe tener como max 140 chars
    const status = `Hola @${tweet.user.screen_name}, me comentaste: ${tweet.text.replace(/\s*@digevobot\s*/ig, '')}`;

    twitter.post('statuses/update',
        { status: status, in_reply_to_status_id: tweet.id_str },
        function (err, data, response) {
            if (err) {
                console.error(err);
            } else {
               // console.log(data);
               console.log("Ok");
            }
        });
}
