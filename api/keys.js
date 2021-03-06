const scopes = [
    'streaming',
    "user-read-birthdate",
    "user-read-email",
    'user-read-private',
    'user-read-birthdate',
    'user-read-private',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-read-playback-state',
    'user-read-currently-playing',
    'user-modify-playback-state',
    'user-top-read',
    'user-read-recently-played',
];
const SpotifyWebApi = require('spotify-web-api-node');
const spotifyApi = new SpotifyWebApi({
    scope:scopes.join(' '),
    clientId: process.env.SPOTIFY_ID,
    clientSecret: process.env.SPOTIFY_SECRET,
    redirectUri: process.env.SPOTIFY_CALLBACK
});


module.exports = {
    MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
    musixmatchKey:process.env.MUSIXMATCH_KEY,
    geniusClientId: process.env.GENIUS_ID,
    geniusClientSecret: process.env.GENIUS_SECRET,
    geniusRedirectUri: process.env.GENIUS_CALLBACK,
    geniusAccessToken: process.env.GENIUS_TOKEN,
    geniusScope:["me"], //['me', 'create_annotation', 'manage_annotation', 'vote']
    spotifyClientId: process.env.SPOTIFY_ID,
    spotifyClientSecret: process.env.SPOTIFY_SECRET,
    spotifyRedirectUri: process.env.SPOTIFY_CALLBACK,
    spotifyScopes: scopes,
    spotifyApi:spotifyApi,
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    twitterConsumerKey:process.env.TWITTER_CONSUMER_KEY,
    twitterConsumerSecret:process.env.TWITTER_CONSUMER_SECRET,
    twitterAccessTokenKey:process.env.TWITTER_ACCESS_TOKEN_KEY,
    twitterAccessTokenSecret:process.env.TWITTER_ACCESS_TOKEN_SECRET,
    mysqlHost:process.env.MYSQL_HOST,
    mysqlPort:process.env.MYSQL_PORT,
    mysqlDatabase:process.env.MYSQL_DB,
    mysqlUser:process.env.MYSQL_USER,
    mysqlPassword:process.env.MYSQL_PW,
    // pgUser: process.env.PGUSER,
    // pgHost: process.env.PGHOST,
    // pgDatabase: process.env.PGDATABASE,
    // pgPassword: process.env.PGPASSWORD,
    // pgPort: process.env.PGPORT
};
