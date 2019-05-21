const keys = require('../keys');
const SpotifyWebApi = require('spotify-web-api-node');

const authorizationCode = '<insert authorization code>';

const spotifyApi = new SpotifyWebApi({
    clientId: keys.spotifyClientId,
    clientSecret: keys.spotifyClientSecret,
    redirectUri: keys.spotifyRedirectUri
});

spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    console.log('Retrieved access token', data.body['access_token']);

    // Set the access token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to retrieve information about the user connected to it
    return spotifyApi.searchTracks('Love');
  })
  .then(function(data) {
    // Print some information about the results
    console.log('I got ' + data.body.tracks.total + ' results!');

    // Go through the first page of results
    var firstPage = data.body.tracks.items;
    console.log(
      'The tracks in the first page are.. (popularity in parentheses)'
    );

    /*
     * 0: All of Me (97)
     * 1: My Love (91)
     * 2: I Love This Life (78)
     * ...
     */
    firstPage.forEach(function(track, index) {
      console.log(index + ': ' + track.name + ' (' + track.popularity + ')');
    });
  })
  .catch(function(err) {
    console.log('Something went wrong:', err.message);
  });
