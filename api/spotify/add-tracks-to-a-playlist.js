const keys = require('../keys');
var SpotifyWebApi = require('spotify-web-api-node');

/**
 * documented here: https://developer.spotify.com/spotify-web-api/authorization-guide/#authorization_code_flow
 * https://developer.spotify.com/spotify-web-api/using-scopes/
 */

var authorizationCode = '<insert authorization code>';

const spotifyApi = new SpotifyWebApi({
    clientId: keys.spotifyClientId,
    clientSecret: keys.spotifyClientSecret,
    redirectUri: keys.spotifyRedirectUri
});

// First retrieve an access token
spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    spotifyApi.setAccessToken(data.body['access_token']);
    return spotifyApi.addTracksToPlaylist(
      'thelinmichael',
      '5ieJqeLJjjI8iJWaxeBLuK',
      [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ],
      {
        position: 10
      }
    );
  })
  .then(function(data) {
    console.log('Added tracks to the playlist!');
  })
  .catch(function(err) {
    console.log('Something went wrong!', err.message);
  });
