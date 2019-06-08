import axios from 'axios';

export default{
    methods: {
        c_getMe:function(){
            axios.get('/api/spotify/me/get_me/'+this.spotify.credential.access_token)
                .then(res => {
                    if(!!res.data) this.a_spotify(['set','me',res.data]);
                }).catch(error => {
                console.log(error);
            });
        },
        c_getMyPlaylists:function(){
            axios.get('/api/spotify/me/get_user_playlists/'+this.spotify.credential.access_token+'/'+this.spotify.me.id)
                .then(res => {
                    if(!!res.data){
                        this.a_spotify(['set','playlists',res.data.items]);
                        this.a_spotify(['set','playlistID',res.data.items[0].id]);
                    }
                }).catch(error => {
                console.log(error);
            });
        },

        c_getMyTopTracks:function(cb=null){
            axios.get('/api/spotify/me/get_my_toptracks/'+this.spotify.credential.access_token)
                .then(res => {
                    if(!!res.data){
                       if(res.data.items){
                           this.a_spotify(['set','track',res.data.items[0]]);
                           this.a_spotify(['set','bookmarks',res.data.items]);
                       }
                    }

                    if(cb) cb(res);
                }).catch(error => {
                console.log(error);
            });
        }
    }
}
