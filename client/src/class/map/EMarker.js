import store from '../../store/index';
import axios from 'axios';

const marker0 = {
        center: {
            lat:34.722677,
            lng: 135.492364
        },
        title: "",
        type: "spot",
        spotifyid: null,
        userid:null,
        desc: "",
        public: true,
        thumb: '/static/img/emory/marker_thumb_dummy.jpg',
        markertype:'pod', //pod or mp3
        w: 35,
        h: 35,
        icon: '/static/img/markers/m_dummy.png'
    };

export default class EMarker{

    //data: {title,type,spotifyid,desc,project,public}
    constructor(data) {
        this.marker = {...marker0, ...data};
    }

    init(){
        this.marker.title = this.marker.title ? this.marker.title : 'new '+this.marker.type;
        if(this.marker.type==='mainuser')  this.initMainuser();
        return this.marker;
    }

    update(firebaseRef){

        this.init();
        if(this.marker.id) {

            if(this.marker.id==="GUEST"){
                //ゲストの場合
                console.log("GUEST update!!!");
                console.log(this.marker);

                this.marker.center = store.state.mapstore.map.center;
                this.marker.title ="GUEST";
                this.marker.thumb = "/static/img/markers/m_dummy.png";
                store.commit('mapstore/setMainuser',this.marker);

            }else{
                //それ以外はFirebaseをアップデード
                let updates = {};
                updates[this.marker.id] = this.marker;
                firebaseRef.update(updates);
            }

        }
    }

    guestUpdate(){
            this.marker.center = store.state.mapstore.map.center;
            this.marker.title ="GUEST";
            this.marker.thumb = "/static/img/markers/m_dummy.png";
            return this.marker;
    }

    mp3(update,firebaseRef){
        console.log("EMarker:mp3");

        this.marker.thumb = '/static/img/emory/marker_thumb_dummy.jpg';

        if(update){
            //アップデート
            let updates = {};
            updates[this.marker.id] = this.marker;
            firebaseRef.update(updates);
        }else{
            //新規保存
            let result =  firebaseRef.push(this.marker);
            if(this.marker.type==='mainuser') store.commit('mapstore/setMainuser',{id:result.key});
        }
    }

    podcast(update,firebaseRef){

        //Podcast APIがないので、サーチ結果から探るしかない
        if(store.state.spotify.episodes){
            let episode = store.state.spotify.episodes.items.filter(ep=>ep.id===this.marker.spotifyid)[0];
            if(episode){
                this.marker.thumb       = episode.images[0].url;
                this.marker.spotifytype = episode.type;
                this.marker.spotifyname = episode.name;
                this.marker.mp3         = episode.audio_preview_url; //Episodeの場合、APIで再生できないのでmp3のアドレスも登録する。
            }
        }

        if(update){
            //アップデート
            let updates = {};
            updates[this.marker.id] = this.marker;
            firebaseRef.update(updates);
        }else{
            //新規保存
            let result =  firebaseRef.push(this.marker);
            if(this.marker.type==='mainuser') store.commit('mapstore/setMainuser',{id:result.key});
        }
    }

    spotifyitem(update, firebaseRef) {

        this.checkSpotify(res => {
            if (res.data !== "") {
                if (res.data.body.type === 'track') {
                    this.marker.thumb = res.data.body.album.images[0].url;
                    this.marker.spotifytype = 'track';
                    this.marker.spotifyname = res.data.body.name;
                } else if (res.data.body.type === 'playlist' || res.data.body.type === 'album' || res.data.body.type === 'artist') {
                    this.marker.thumb = res.data.body.images[0].url;
                    this.marker.spotifytype = res.data.body.type;
                    this.marker.spotifyname = res.data.body.name;
                } else {
                    console.log(res.data.body);
                }

                if (update) {
                    //アップデート
                    let updates = {};
                    updates[this.marker.id] = this.marker;
                    firebaseRef.update(updates);
                } else {
                    //新規保存
                    let result = firebaseRef.push(this.marker);
                    if (this.marker.type === 'mainuser') store.commit('mapstore/setMainuser', {id: result.key});
                }

            } else {
                store.commit('setAlertText', "利用にはSpotifyログインします。");
                store.commit('setAlertState', true);
                store.commit('setAlertAction', "login");
            }
        });
    }

    firebaseUpdate(firebaseRef){
        let update = this.marker.id && firebaseRef.child(this.marker.id);

        // MP3の場合
        if (this.marker.markertype === 'mp3') {
            this.mp3(update,firebaseRef);
        } else if (this.marker.spotifyid) {
            // Episodeの場合
            if (this.marker.markertype === 'pod') {
                //if (!this.marker.mp3)
                    this.podcast(update,firebaseRef);
            // その他のSpotifyのアイテムの場合
            } else if (this.marker.markertype === 'track') {
                //if (!this.marker.mp3)
                    this.spotifyitem(update, firebaseRef);
            }
        } else {
            store.commit('setAlertText', "Spotify IDが入力されていません。");
            store.commit('setAlertState', true);
        }

        return this.marker;
    }


    updateOrNew(firebaseRef){
        this.init();
        if(this.marker.id==="GUEST"){
            this.guestUpdate();
        }else{
            this.firebaseUpdate(firebaseRef);
        }
    }

    initMainuser(){
        console.log("[EMarker] initMainUser");
        if(store.state.spotify.me){

            this.marker.title       = store.state.spotify.me.display_name;
            this.marker.userid      = store.state.spotify.me.id;
            if(store.state.spotify.bookmarks){
                // this.marker.spotifyid   = store.state.spotify.bookmarks[0].id;
                // this.marker.spotifytype = store.state.spotify.bookmarks[0].type;
                // this.marker.thumb       = store.state.spotify.bookmarks[0].album.images[0].url;
                //ユーザー情報は表示させないので、とりあえずダミーにしておく。
                this.marker.spotifyid   = "5xcb3TD6lZ4X7RId59DNxo";
                this.marker.spotifytype = "track";
                this.marker.thumb = '/static/img/emory/marker_thumb_dummy.jpg';
            }else{
                //ダミーでプリンス
                this.marker.spotifyid   = "5xcb3TD6lZ4X7RId59DNxo";
                this.marker.thumb = '/static/img/emory/marker_thumb_dummy.jpg';
            }
            this.marker.project     = "mainuser";
        }
        this.marker.center = store.state.mapstore.map.center;
    }

    checkSpotify(cb){
        let headers = {Authorization:store.state.spotify.credential.access_token};
        axios.get('/api/spotify/browse/idcheck',{params:{'anyid': this.marker.spotifyid}, headers: headers}).then(res => cb(res));
    }
}
