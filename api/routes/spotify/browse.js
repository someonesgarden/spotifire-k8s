let express = require('express');
let router = express.Router();
const keys = require('../../keys');
const spotifyApi = keys.spotifyApi;
const WebApiRequest = require('../../node_modules/spotify-web-api-node/src/webapi-request');
const HttpManager   = require('../../node_modules/spotify-web-api-node/src/http-manager');



router.get('/featured', (req,res)=>{
    console.log("here is /featured");
    const access_token = req.headers.authorization;
    spotifyApi.setAccessToken(access_token);

    const country   = req.query.country ? req.query.country : 'JP';
    const options   = {limit:45, country: country, locale: 'ja-JP', 'accept-language':'ja-JP'};

    console.log(options);

    // spotifyApi.getFeaturedPlaylists({ country: country, locale: 'ja-JP', 'accept-language':'ja-JP'}).then(
    //         function(data) {
    //             console.log(data.body);
    //             res.send(data.body);
    //         },
    //         function(err) {
    //             console.log(err.message);
    //             res.send(null);
    //         }
    //     );

    return WebApiRequest.builder(access_token)
        .withPath('/v1/browse/featured-playlists')
        .withHeaders({ 'Content-Type' : 'application/json', 'Accept-Language':'ja;q=1'})
        .withQueryParameters(options)
        .build()
        .execute(HttpManager.get, (err,data)=>{
            if(err){
                console.log('Could not get featured playlists!', err.message);
                res.send(null);
                return;
            }
            res.send(data.body);
        });
});


router.get('/idcheck', (req,res)=>{

    console.log("here is /idcheck");
    const access_token = req.headers.authorization;
    const anyid   = req.query.anyid;
    spotifyApi.setAccessToken(access_token);
    let p1 = spotifyApi.getAlbum(anyid);
    let p2 = spotifyApi.getPlaylist(anyid);

    spotifyApi.getPlaylist(anyid).then((ok1)=>{ res.send(ok1)},
        (no1)=>{
            spotifyApi.getTrack(anyid).then((ok2)=>{res.send(ok2)},
                (no2)=>{
                    spotifyApi.getAlbum(anyid).then((ok3)=>{res.send(ok3)},
                        (no3)=>{
                            spotifyApi.getArtist(anyid).then((ok4)=>{res.send(ok4)},
                                (no4)=>{
                                    res.send('');
                                }).catch(error => {
                                console.log(error);
                            });
                        })
                })
        })
});

router.post('/search', (req,res)=>{
    const data         = req.body;
    const access_token = data.access_token;
    const conditions   = data.conditions;
    const options      = { limit : conditions.limit, offset : conditions.offset};

    return WebApiRequest.builder(access_token)
        .withPath('/v1/search/')
        .withHeaders({ 'Content-Type' : 'application/json', 'Accept-Language':'ja;q=1'})
        .withQueryParameters(
            {
                type: conditions.datatypes.join(','),
                q: conditions.term
            },
            options
        )
        .build()
        .execute(HttpManager.get, (err,data)=>{
            if(err){
                console.log('Could not refresh the token!', err.message);
                res.send(null);
                return;
            }
            res.send(data.body);
        });
});


router.post('/recommendations', (req,res)=>{
    const data = req.body;
    const access_token = data.access_token;
    const queries   = data.queries ? data.queries : { min_energy: 0.4, seed_artists: ['4og9jrin5xH5JiFPbeGUPb', '6l3HvQ5sa6mXTsMTB19rO5'], min_popularity: 10 };

    console.log(queries);

    spotifyApi.setAccessToken(access_token);
    spotifyApi.getRecommendations(queries).then(
        function(data) {
            res.send(data.body);
        },
        function(err) {
            console.log(err.message);
            res.send(null);
        }
    );
});


module.exports = router;
