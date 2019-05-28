let express = require('express');
let router = express.Router();
const keys = require('../../keys');
const spotifyApi = keys.spotifyApi;


router.get('/byid', (req,res)=>{
    const access_token = req.headers.authorization;
    const trackid = req.query.trackid;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.getTrack(trackid).then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not get track info!', err.message);
            res.send(null);
        }
    );
});


router.get('/features', (req,res)=>{
    const access_token = req.headers.authorization;
    const trackid = req.query.trackid;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.getAudioFeaturesForTrack(trackid).then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not get track audio features!', err.message);
            res.send(null);
        }
    );
});


router.get('/analysis', (req,res)=>{
    const access_token = req.headers.authorization;
    const trackid = req.query.trackid;

    spotifyApi.setAccessToken(access_token);
    spotifyApi.getAudioAnalysisForTrack(trackid).then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log('Could not get track audio analysis!', err.message);
            res.send(null);
        }
    );
});

module.exports = router;
