import store from '../../store/index';
import axios from 'axios';

const marker0 = {
        center: null,
        title: "",
        type: "spot",
        spotifyid: "",
        userid:null,
        desc: "",
        project: "",
        public: 'open',
        thumb: null,
        w: 35,
        h: 35,
        icon: '/static/img/markers/m_dummy.png'
    };

export default class EMarker{

    //data: {title,type,spotifyid,desc,project,public}
    constructor(data) {
        this.marker = marker0;
        this.marker = {...this.marker, ...data};
    }

    init(){
        this.marker.title = this.marker.title ? this.marker.title : 'new '+this.marker.type;
        if(this.marker.type==='mainuser')  this.initMainuser();
        return this.marker;
    }

    updateOrNew(firebaseRef){
        let update = true;
        let updates = {};
        this.init();

        if(this.marker.id){
            if(!firebaseRef.child(this.marker.id)) update = false;
        }else{
            update = false;
        }

        if(this.marker.spotifyid){
            this.checkSpotify(res=>{
                if(res.data!==""){
                    if(res.data.body.type==='track'){
                        this.marker.thumb = res.data.body.album.images[0].url;
                        this.marker.spotifytype = 'track';
                        this.marker.desc = res.data.body.name;
                    }
                    if(update){
                        //アップデート
                        updates[this.marker.id] = this.marker;
                        firebaseRef.update(updates);
                    }else{
                        //新規保存
                        let result =  firebaseRef.push(this.marker);
                        if(this.marker.type==='mainuser') store.commit('mapstore/setMainuser',{id:result.key});
                    }

                }else{
                    store.commit('setAlertText',"IDが間違えています。入力し直してください。");
                    store.commit('setAlertState',true);
                }
            });
        }else{
            store.commit('setAlertText',"Spotify IDが入力されていません。");
            store.commit('setAlertState',true);
        }
    }

    initMainuser(){
        if(store.state.spotify.me){
            this.marker.userid      = store.state.spotify.me.id;
            this.marker.spotifyid   = store.state.spotify.bookmarks[0].id;
            this.marker.spotifytype = store.state.spotify.bookmarks[0].type;
            this.marker.thumb       = store.state.spotify.bookmarks[0].album.images[0].url;
        }

        this.marker.center = store.state.mapstore.map.center;
    }

    checkSpotify(cb){
        let headers = {Authorization:store.state.spotify.credential.access_token};
        axios.get('/api/spotify/browse/idcheck',{params:{'anyid': this.marker.spotifyid}, headers: headers}).then(res => cb(res));
    }
}