const keys = require('../keys');
var SpotifyWebApi = require('spotify-web-api-node');

/*
 * This example shows how to get artists related to another artists. The endpoint is documented here:
 * https://developer.spotify.com/web-api/get-related-artists/
 */

var spotifyApi = new SpotifyWebApi();

var artistId = '0qeei9KQnptjwb8MgkqEoy';

spotifyApi.getArtistRelatedArtists(artistId).then(
  function(data) {
    if (data.body.artists.length) {
      console.log('I got ' + data.body.artists.length + ' similar artists!');
      console.log('The most similar one is ' + data.body.artists[0].name);
    } else {
      console.log("I didn't find any similar artists.. Sorry.");
    }
  },
  function(err) {
    console.log('Something went wrong..', err.message);
  }
);
