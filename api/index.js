const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys');
const spotifyRouter = require('./routes/spotify/index');
const twitterRouter = require('./routes/twitter/index');
const analyzeRouter = require('./routes/analyzer/index');
const mysqlRouter   = require('./routes/mysql/index');

//*-------------------------------  REDIS
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000});
const redisPublisher = redisClient.duplicate();
//*-------------------------------  REDIS


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// CORSを許可する
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/spotify', spotifyRouter);
app.use('/twitter', twitterRouter);
app.use('/analyze', analyzeRouter);
app.use('/mysql',   mysqlRouter);

app.listen(5000, err => {
  console.log('Listening on Port 5000');
});
