const keys = require('../keys');

var SpotifyWebApi = require('spotify-web-api-node');

/* Retrieve a code as documented here:
 * https://developer.spotify.com/spotify-web-api/authorization-guide/#authorization_code_flow
 * https://developer.spotify.com/spotify-web-api/using-scopes/
 */
var authorizationCode =
  'AQAgjS78s64u1axMCBCRA0cViW_ZDDU0pbgENJ_-WpZr3cEO7V5O-JELcEPU6pGLPp08SfO3dnHmu6XJikKqrU8LX9W6J11NyoaetrXtZFW-Y58UGeV69tuyybcNUS2u6eyup1EgzbTEx4LqrP_eCHsc9xHJ0JUzEhi7xcqzQG70roE4WKM_YrlDZO-e7GDRMqunS9RMoSwF_ov-gOMpvy9OMb7O58nZoc3LSEdEwoZPCLU4N4TTJ-IF6YsQRhQkEOJK';

const spotifyApi = new SpotifyWebApi({
    scope:'streaming user-read-birthdate user-read-email user-read-private playlist-modify-public playlist-modify-private user-library-read user-modify-playback-state user-read-playback-state',
    clientId: keys.spotifyClientId,
    clientSecret: keys.spotifyClientSecret,
    redirectUri: keys.spotifyRedirectUri
});

var tokenExpirationEpoch;

// First retrieve an access token
spotifyApi.authorizationCodeGrant(authorizationCode).then(
  function(data) {
    // Set the access token and refresh token
    spotifyApi.setAccessToken(data.body['access_token']);
    spotifyApi.setRefreshToken(data.body['refresh_token']);

    // Save the amount of seconds until the access token expired
    tokenExpirationEpoch =
      new Date().getTime() / 1000 + data.body['expires_in'];
    console.log(
      'Retrieved token. It expires in ' +
        Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
        ' seconds!'
    );
  },
  function(err) {
    console.log(
      'Something went wrong when retrieving the access token!',
      err.message
    );
  }
);

// Continually print out the time left until the token expires..
var numberOfTimesUpdated = 0;

setInterval(function() {
  console.log(
    'Time left: ' +
      Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
      ' seconds left!'
  );

  // OK, we need to refresh the token. Stop printing and refresh.
  if (++numberOfTimesUpdated > 5) {
    clearInterval(this);

    // Refresh token and print the new time to expiration.
    spotifyApi.refreshAccessToken().then(
      function(data) {
        tokenExpirationEpoch =
          new Date().getTime() / 1000 + data.body['expires_in'];
        console.log(
          'Refreshed token. It now expires in ' +
            Math.floor(tokenExpirationEpoch - new Date().getTime() / 1000) +
            ' seconds!'
        );
      },
      function(err) {
        console.log('Could not refresh the token!', err.message);
      }
    );
  }
}, 1000);
