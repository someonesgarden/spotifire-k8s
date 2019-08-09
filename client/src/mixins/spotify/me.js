import axios from 'axios';

export default{

    methods: {

        c_checkLoginStatus:function(cb){
            //ローカルストレージにSpotifyログイン情報が有効ならStoreに保存

            if(localStorage.getItem('credentials')){
                let cred = JSON.parse(localStorage.getItem('credentials'));

                if(cred && cred.data){
                    let date = new Date();
                    if((date.getTime() - cred.timestamp) < cred.data.expires_in*1000){
                        this.a_spotify(['set','credential',cred.data]);
                        this.c_getMe(cb);
                    }else{
                        //this.c_set2LS("credentials",null);
                        localStorage.removeItem('credential');
                        cb(null);
                    }
                }else{
                    cb(null);
                }

            }else{
                cb(null);
            }
        },

        c_getMe:function(cb=null){
            axios.get('/api/spotify/me/get_me/'+this.spotify.credential.access_token)
                .then(res => {
                    if(!!res.data){
                        this.a_spotify(['set','me',res.data]);
                        this.c_set2LS('username',res.data.id);//ローカルストレージに保存
                        if(cb) cb(res);
                    }
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
                           this.a_index(['alert','close']);
                       }
                    }

                    if(cb) cb(res);
                }).catch(error => {
                console.log(error);
            });
        },

        c_clickAction: function (type, val) {
            this.a_spotify(['set', type + 'ID', val]);
            this.a_spotify(['update', 'item', type]);
        }
    }
}
