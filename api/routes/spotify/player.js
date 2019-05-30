let express = require('express');
let router = express.Router();
const keys = require('../../keys');
const spotifyApi = keys.spotifyApi;

router.get('/devices', (req,res)=>{
    const access_token = req.headers.authorization;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.getMyDevices().then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not get connected devices!', err.message);
            res.send(null);
        }
    );
});

router.get('/currentplayback', (req,res)=>{
    const access_token = req.headers.authorization;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.getMyCurrentPlaybackState().then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not get current playback state!', err.message);
            res.send(null);
        }
    );
});

router.get('/transferplayback', (req,res)=>{
    const access_token = req.headers.authorization;
    const deviceid   = req.query.deviceid;
    console.log(deviceid);
    spotifyApi.setAccessToken(access_token);

    spotifyApi.transferMyPlayback({
        deviceIds: [ deviceid ],
        play: false
    }).then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not transfer playback!', err.message);
            res.send(null);
        }
    );
});


router.post('/play', (req,res)=>{
    const data = req.body;
    const access_token = data.access_token;
    const device_id = data.device_id;
    const trackid = data.trackid;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.play({device_id:device_id, uris:["spotify:track:"+trackid]}).then(
        function(data) {
            res.send(data);
        },
        function(err) {
            console.log('player error', err.message);
            res.send(null);
        }
    );
});

router.get('/pause', (req,res)=>{
    const access_token = req.headers.authorization;
    spotifyApi.setAccessToken(access_token);
    spotifyApi.pause().then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not stop player!', err.message);
            res.send(null);
        }
    );
});

module.exports = router;
