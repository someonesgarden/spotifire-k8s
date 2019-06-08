import store from '../../store/index';
import axios from 'axios';

const  project0 = {
        center:null,
        zoom:22,
        spotifyid: "",
        title:"",
        desc: "",
        thumb: null
    };

export default class EProject{

    constructor(data) {
        this.project = {...project0, ...data};
    }

    init(){
        this.project.title = this.project.title ? this.project.title : 'new project';
        return this.project;
    }

    updateOrNew(firebaseRef){
        let update = true;
        let updates = {};
        this.init();

        if(this.project.id){
            if(!firebaseRef.child(this.project.id)) update = false;
        }else{
            update = false;
        }

        if(this.project.spotifyid){
            this.checkSpotify(res=>{
                if(res.data!==""){
                    if(res.data.body.type==='track'){
                        this.project.thumb = res.data.body.album.images[0].url;
                        this.project.spotifytype = 'track';
                        this.project.spotifyname = res.data.body.name;
                    }else if(res.data.body.type==='playlist' || res.data.body.type==='album' || res.data.body.type==='artist'){
                        this.project.thumb = res.data.body.images[0].url;
                        this.project.spotifytype = res.data.body.type;
                        this.project.spotifyname = res.data.body.name;
                    }else{
                        console.log(res.data.body);
                    }

                    if(update){
                        //アップデート
                        updates[this.project.id] = this.project;
                        firebaseRef.update(updates);
                    }else{
                        //新規保存
                        let result =  firebaseRef.push(this.project);
                    }

                }else{
                    store.commit('setAlertText',"利用にはSpotifyログインします。p");
                    store.commit('setAlertState',true);
                    store.commit('setAlertAction',"login");
                }
            });
        }else{
            store.commit('setAlertText',"Spotify IDが入力されていません。。");
            store.commit('setAlertState',true);
            store.commit('setAlertAction',"login");
        }
    }


    checkSpotify(cb){
        let headers = {Authorization:store.state.spotify.credential.access_token};
        axios.get('/api/spotify/browse/idcheck',{params:{'anyid': this.project.spotifyid}, headers: headers})
            .then(res => cb(res)).catch(error => {
            console.log(error);
        });
    }
}
