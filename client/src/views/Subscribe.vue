<template>
    <mu-container id="Subscribe">
        <div class="base">
            <div class="ui grid" v-if="subscribe.initials">

                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column">
                    <mu-chip v-for="(initial,index) in subscribe.initials"
                             @click="openSnack('initial',index)"
                             :key="'initial'+index" color="deepPurple700" :style="{fontSize:0.3+0.25*tracksOnInitial(initial.spotifyids)+'rem'}">{{initial.initial}}</mu-chip>
                </div>
            </div>

            <div class="ui grid" v-if="subscribe.lyrics">
                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column">

                    <mu-chip class="chip-populartrack" color="orange500" v-for="(lyric,index) in subscribe.lyrics"
                             :key="'pt'+index" delete
                             @click="openSnack('track',index)"
                             @delete="alertAction('lyrics',lyric.id,index)">
                        <mu-avatar :size="22">
                            <img :src="lyric.thumb">
                        </mu-avatar>
                        {{lyric.song}}
                        <span class="artist">{{lyric.artist | truncate20}}</span>
                    </mu-chip>
                </div>
            </div>

            <div class="ui grid" v-if="subscribe.lyrics">
                <div class="sixteen wide mobile sixteen wide tablet sixteen wide computer column">
                    <mu-chip :color="morphChipColor(mo.length)" v-for="(mo,key,index) in morphsByCondition"
                             :key="'m'+index" :style="{fontSize:0.3+0.1*mo.length+'rem'}" delete
                             @click="openSnack('feature',key)"
                             @delete="alertAction('morphs',{mo:mo,key:key},index)">
                        {{key}}
                    </mu-chip>
                </div>
            </div>
        </div>

        <mu-dialog title="削除する" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open="delAlert">
            <p>決定をクリックすると削除されます。この処理は取り消せません。<br/>削除しない場合は「キャンセル」を押してください。</p>
            <mu-button slot="actions" flat color="primary" @click="delAlert=false">キャンセル</mu-button>
            <mu-button slot="actions" flat color="primary" @click="delAction">決定</mu-button>
        </mu-dialog>

        <mu-snackbar class="subscribe_snackbar" :position="'bottom'" :open.sync="snackbar.open" v-if="snackbar.key" :class="[snackbar.type]">
            <div v-if="morphs && snackbar.type==='feature'">
                <snack-feature-item v-for="(lyric,index) in lyricsFromMorphs(morphs[snackbar.key])" :key="'feature'+lyric.spotifyid+index" :lyric="lyric"></snack-feature-item>
            </div>
            <div v-else-if="snackbar.type==='track'">
                <snack-track :lyric="subscribe.lyrics[snackbar.key]"></snack-track>
            </div>
            <div v-else-if="snackbar.type==='initial'">
                {{JSON.stringify(subscribe.initials[snackbar.key])}}
            </div>
            <mu-button flat slot="action" color="red" @click="closeSnack">
                <mu-icon value="close" :size="30"></mu-icon>
            </mu-button>
        </mu-snackbar>
    </mu-container>
</template>

<script>
    import axios from 'axios';
    import _ from 'lodash';
    import {mapGetters,mapActions} from 'vuex';
    import musixMixin from '../mixins/musixmatch';
    import mysqlMixin from '../mixins/mysql';
    import feedMixin from '../mixins/feed/index';
    import utilMixin from '../mixins/util';

    import SnackFeatureItem from '../components/Subscribe/SnackFeature';
    import SnackTrack from '../components/Subscribe/SnackTrack';

    export default {
        name: "Subscribe",
        bodyClass: "subscribe-page",
        mixins:[musixMixin,mysqlMixin,feedMixin,utilMixin],
        components:{
            SnackFeatureItem,
            SnackTrack
        },
        data(){
            return{
                delAlert:false,
                delId:null,
                delObj:null,
                delIndex:null,
                delAction:null,
                snackbar:{
                    type:null,
                    key:null,
                    open:false
                },
                morphs:null
            }
        },
        computed:{
            ...mapGetters(['spotify','subscribe']),
            morphsByCondition(){
                if(this.subscribe.lyrics){
                    let morphs_= {};
                    this.subscribe.lyrics.forEach((lyric,index)=>{
                        let ms_ = JSON.parse(lyric.morphs);
                        ms_.forEach(ms=>{
                            if(!morphs_[ms]){
                                morphs_[ms] = [{id:lyric.id, index:index}]
                            }else{
                                morphs_[ms].push({id:lyric.id, index:index})
                            }
                        })
                    })
                    this.morphs = morphs_;
                    return morphs_;
                }
                return null;
            },
        },
        watch:{
            'subscribe.update':{
                handler(newState){
                    let reducers = {
                        initials: ()=> this.loadInitials(),
                        lyrics:   ()=> this.loadLyrics()
                    };
                    if (!reducers[newState.type]) return false;
                    return reducers[newState.type]()
                },
                deep:true
            }
        },

        mounted:function(){
            this.loadInitials();
            this.loadLyrics();
        },
        methods:{
            ...mapActions(['a_index','a_subscribe']),

            morphChipColor(num){

                let reducers = {
                    2: ()=> "pink400",
                    3: ()=> "purple300",
                    4: ()=> "indigo400",
                    5: ()=> "amber400",
                    6: ()=>  "cyan500",
                    7: ()=>  "deepPurple400",
                    8: ()=>  "blue400",
                    9: ()=>  "green500",
                    10: ()=>  "lightGreen400",
                    11: ()=>  "lime500",
                    12: ()=>  "orange400",
                    13: ()=>  "brown400",
                    14: ()=>  "blueGrey400",
                    15: ()=>  "deepOrange400",
                    16: ()=>  "grey400",
                    17: ()=>  "red400",
                    18: ()=>  "indigoA700",
                    19: ()=>  "deepPurpleA400",
                    20: ()=>  "blueA400",
                };
                if (!reducers[num]) return Math.floor(Math.random()*2)=== 0 ? "teal600" : "teal400";
                return reducers[num]()
            },

            lyricsFromMorphs(morphs){
                if(typeof morphs !== 'undefined'){
                    return morphs.map(morph=> this.subscribe.lyrics[morph.index]);
                }

                return [];

               /*
                 acousticness: (...)

                    danceability: (...)
                    energy: (...)
                    genres: (...)
                    id: (...)
                    isrc: (...)
                    link: (...)
                    liveness: (...)

                    mode: (...)

                    spotifyid: (...)
                    spotifytype: (...)
                    tempo: (...)

                    valence: (..
                */
            },

            openSnack(type, key) {
                  this.snackbar.type = type;
                  this.snackbar.open = true;
                  this.snackbar.key = key;
            },

            closeSnack(){
              this.snackbar.open = false;
              this.snackbar.id = null;
            },

            alertAction(action,obj,index){
                this.delAlert = true;
                let reducers = {
                    lyrics:()=> {
                        this.delId = obj;
                        this.delIndex = index;
                        this.delAction = this.deleteLyricComplete;
                    },
                    morphs:()=>{
                        this.delObj = obj;
                        this.delAction = this.deleteMorphComplete;
                    }
                };

                if(!reducers[action]) return false;
                return reducers[action]();
            },


            deleteLyricComplete(){
                //データベースから削除
                if(this.delId){
                    axios.get(window.dbDomain+'/api/mysql/lyrics/delete',{params:{'id':this.delId}}).then(res => {
                        if(res){
                            //Storeから削除
                            this.a_subscribe(['delete','lyric', this.delIndex]);
                            this.delId = null;
                            this.delIndex = null;
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }

                this.delAlert = false;
            },

            deleteMorphComplete(){
                let key = this.delObj.key;
                let entries = this.delObj.mo;
                let queries = entries.length>0 ? entries.map(obj=> axios.post(window.dbDomain+'/api/mysql/lyrics/updatemorph', {morph:key,id:obj.id})) : null;

                Promise.all(queries).then(res=>{
                    //Lyricsデータを更新
                    console.log(res);
                    this.a_subscribe(['set','update', 'lyrics']);
                    this.delObj = null;
                    this.delIndex = null;
                }).catch(error => console.log(error));

                this.delAlert = false;
            },

            tracksOnInitial(ids){
                return ids.split('|').length
            },

            loadInitials(){
                console.log("loadInitials from spotife.work(laravel)..");
                axios.get(window.dbDomain+'/api/mysql/initials/all')
                    .then(res => { if(res) this.a_subscribe(['set','initials',res.data])})
                    .catch(error => { console.log(error)});
            },

            loadLyrics(){
                console.log("loadLyrics from spotife.work(laravel)..");
                axios.get(window.dbDomain+'/api/mysql/lyrics/all')
                    .then(res => { if(res) this.a_subscribe(['set','lyrics',res.data])})
                    .catch(error => { console.log(error)});
            }
        }
    }
</script>
