const keys = require('../keys');
const SpotifyWebApi = require('spotify-web-api-node');
const code = 'MQCbtKe23z7YzzS44KzZzZgjQa621hgSzHN';
const spotifyApi = new SpotifyWebApi({
    scope:'streaming user-read-birthdate user-read-email user-read-private playlist-modify-public playlist-modify-private user-library-read user-modify-playback-state user-read-playback-state',
    clientId: keys.spotifyClientId,
    clientSecret: keys.spotifyClientSecret,
    redirectUri: keys.spotifyRedirectUri
});

let getAccessToken = ()=> spotifyApi.clientCredentialsGrant();
let refreshToken = (code)=> spotifyApi.refreshAccessToken(code);

module.exports = {
    getAccessToken:getAccessToken,
    refreshToken:refreshToken
}
