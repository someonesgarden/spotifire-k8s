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

        c_deviceSelected:function(val){
            this.c_transferplayback(val,(res)=>{  })
        },

        c_pause: function () {
            let headers = {Authorization:this.spotify.credential.access_token};
            axios.get('/api/spotify/player/pause',{params:{}, headers: headers})
                .then(res => {
                }).catch(error => {
                console.log(error);
            });
        },

        c_play: function (id,type='track',device_id) {
            const params = {
                id:id,
                type:type,
                access_token:this.spotify.credential.access_token,
                device_id:device_id
            };

            console.log('/api/spotify/player/play');
            console.log(params);

            axios.post('/api/spotify/player/play',params)
                .then(res => {

                    console.log(res);
                }).catch(error => {
                console.log(error);
            });
        },

        c_playEpisode: function (id) {
            console.log("c_playEpisode:"+id);
        },

        c_initplayer: function () {

            window.onSpotifyWebPlaybackSDKReady = () => {

                //window.alert("onSpotifyWebPlaybackSDKReady!");
                const token = this.spotify.credential.access_token;
                console.log("token!",token);

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
                    this.c_transferplayback(device_id,(res)=> this.a_spotify(['set','device', device_id]))
                    this.c_devices((res)=> this.a_spotify(['set','devices',res.data.devices]));
                });

                // Not Ready
                window.player.addListener('not_ready', ({ device_id }) => {
                    this.a_spotify(['set','device', null]);
                    this.c_devices((res)=> this.a_spotify(['set','devices',res.data.devices]));
                });

                // Connect to the player!
                window.player.connect();
            };

            window.onSpotifyWebPlaybackSDKReady();
        },
    }
}
