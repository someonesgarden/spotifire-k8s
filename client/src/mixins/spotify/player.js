import axios from 'axios';

export default{

    methods: {
        c_devices: function (cb) {
            let headers = {Authorization:this.spotify.credential.access_token};
            axios.get('/api/spotify/player/devices',{params:{}, headers: headers})
                .then(res => {
                    cb(res);
                }).catch(error => {
                console.log(error);
            });
        },

        c_currentplayback:function(cb){
            let headers = {Authorization:this.spotify.credential.access_token};
            axios.get('/api/spotify/player/currentplayback',{params:{}, headers: headers})
                .then(res => {
                    cb(res);
                }).catch(error => {
                console.log(error);
            });
        },

        c_transferplayback:function(deviceid, cb){

            this.a_spotify(['set','device',deviceid]);

            let params =  {'deviceid': deviceid};
            let headers = {Authorization:this.spotify.credential.access_token};
            axios.get('/api/spotify/player/transferplayback',{params:params, headers: headers})
                .then(res => {
                    cb(res);
                }).catch(error => {
                console.log(error);
            });
        },

        c_pause: function () {
            let headers = {Authorization:this.spotify.credential.access_token};
            axios.get('/api/spotify/player/pause',{params:{}, headers: headers})
                .then(res => {
                }).catch(error => {
                console.log(error);
            });
        },

        c_play: function (device_id, id) {
            const params = {
                trackid:id,
                access_token:this.spotify.credential.access_token,
                device_id:device_id
            };
            axios.post('/api/spotify/player/play',params)
                .then(res => {
                }).catch(error => {
                console.log(error);
            });
        },

        c_initplayer: function () {

            window.onSpotifyWebPlaybackSDKReady = () => {

                //window.alert("onSpotifyWebPlaybackSDKReady!");
                const token = this.spotify.credential.access_token;

                window.player = new Spotify.Player({
                    name: 'Spotifire PC',
                    getOAuthToken: cb => { cb(token); }
                });

                // Error handling
                window.player.addListener('initialization_error', ({ message }) => {
                    //window.alert(message);
                    console.error(message);
                });
                window.player.addListener('authentication_error', ({ message }) => {
                    //window.alert(message);
                    console.error(message);
                });
                window.player.addListener('account_error', ({ message }) => {
                    //window.alert(message);
                    console.error(message);
                });
                window.player.addListener('playback_error', ({ message }) => {
                    //window.alert(message);
                    console.error(message);
                });

                // Playback status updates
                window.player.addListener('player_state_changed', state => this.a_spotify(['player','playing',!state.paused]));

                // Ready
                window.player.addListener('ready', ({ device_id }) => {
                    this.c_devices((res)=> this.a_spotify(['set','devices',res.data.devices]))
                    this.c_transferplayback(device_id,(res)=> this.a_spotify(['set','device', device_id]))
                });

                // Not Ready
                window.player.addListener('not_ready', ({ device_id }) => this.a_spotify(['set','device', null]));

                // Connect to the player!
                window.player.connect();
            };

            window.onSpotifyWebPlaybackSDKReady();
        },
    }
}
