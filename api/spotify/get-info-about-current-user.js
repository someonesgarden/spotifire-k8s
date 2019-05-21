const keys = require('../keys');
var SpotifyWebApi = require('spotify-web-api-node');

/* Retrieve a code as documented here:
 * https://developer.spotify.com/spotify-web-api/authorization-guide/#authorization_code_flow
 * https://developer.spotify.com/spotify-web-api/using-scopes/
 */
var authorizationCode =
  'AQAgjS78s64u1axMCBCRA0cViW_ZDDU0pbgENJ_-WpZr3cEO7V5O-JELcEPU6pGLPp08SfO3dnHmu6XJikKqrU8LX9W6J11NyoaetrXtZFW-Y58UGeV69tuyybcNUS2u6eyup1EgzbTEx4LqrP_eCHsc9xHJ0JUzEhi7xcqzQG70roE4WKM_YrlDZO-e7GDRMqunS9RMoSwF_ov-gOMpvy9OMb7O58nZoc3LSEdEwoZPCLU4N4TTJ-IF6YsQRhQkEOJK';

const spotifyApi = new SpotifyWebApi({
    clientId: keys.spotifyClientId,
    clientSecret: keys.spotifyClientSecret,
    redirectUri: keys.spotifyRedirectUri
});

// First retrieve an access token
spotifyApi
  .authorizationCodeGrant(authorizationCode)
  .then(function(data) {
    console.log('Retrieved access token', data.body['access_token']);

    // Set the access token
    spotifyApi.setAccessToken(data.body['access_token']);

    // Use the access token to retrieve information about the user connected to it
    return spotifyApi.getMe();
  })
  .then(function(data) {
    // "Retrieved data for Faruk Sahin"
    console.log('Retrieved data for ' + data.body['display_name']);

    // "Email is farukemresahin@gmail.com"
    console.log('Email is ' + data.body.email);

    // "Image URL is http://media.giphy.com/media/Aab07O5PYOmQ/giphy.gif"
    console.log('Image URL is ' + data.body.images[0].url);

    // "This user has a premium account"
    console.log('This user has a ' + data.body.product + ' account');
  })
  .catch(function(err) {
    console.log('Something went wrong', err.message);
  });
