<template>
    <div class="aside listaside">

        <mu-row gutter>
            <mu-col span="8" sm="7" md="7" lg="7" xl="7">
                <mu-list-item  @click="$emit('close')" button class="range">
                    <mu-list-item-title><mu-icon value="close"></mu-icon></mu-list-item-title>
                </mu-list-item>
            </mu-col>
            <mu-col span="4" sm="5" md="5" lg="5" xl="5" style="text-align:right;">
                <mu-button fab small color="grey500" @click="a_index(['bottom','open'])" range>
                    <mu-icon value="border_bottom"></mu-icon>
                </mu-button>

                <mu-button fab small color="black" @click="$emit('leftopen')" range>
                    <mu-icon value="border_left"></mu-icon>
                </mu-button>
            </mu-col>
        </mu-row>

        <mu-divider></mu-divider>

        <mu-container class="range">

            <!--TABS-->
            <mu-row gutter>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="playlist" @click="mode='playlist'" :class="{active:mode==='playlist'}">Playlist</mu-button>
                    <mu-button flat v-else disabled>Playlist</mu-button>
                </div></mu-col>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="album" @click="mode='album'" :class="{active:mode==='album'}">Album</mu-button>
                    <mu-button flat v-else disabled>Album</mu-button>
                </div></mu-col>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="artist" @click="mode='artist'" :class="{active:mode==='artist'}">Artist</mu-button>
                    <mu-button flat v-else disabled>Artist</mu-button>
                </div></mu-col>
            </mu-row>
            <mu-row gutter>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="track" @click="mode='track'" :class="{active:mode==='track'}">Track</mu-button>
                    <mu-button flat v-else disabled>Track</mu-button>
                </div></mu-col>
                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="genius.song" @click="mode='lyrics'" :class="{active:mode==='lyrics'}">Lyrics</mu-button>
                    <mu-button flat v-else disabled>Lyrics</mu-button>
                </div></mu-col>

                <mu-col span="4"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="spotify.generated" @click="mode='generated'" :class="{active:mode==='generated'}">Generate</mu-button>
                    <mu-button flat v-else disabled>Generate</mu-button>
                </div></mu-col>
            </mu-row>
            <mu-row gutter>
                <mu-col span="6"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="show" @click="mode='show'" :class="{active:mode==='show'}">Podcast(Show)</mu-button>
                    <mu-button flat v-else disabled>Podcast(Show)</mu-button>
                </div></mu-col>
                <mu-col span="6"><div class="grid-cell">
                    <mu-button flat color="primary" v-if="episode" @click="mode='episode'" :class="{active:mode==='episode'}">Podcast(Episode)</mu-button>
                    <mu-button flat v-else disabled>Podcast(Episode)</mu-button>
                </div></mu-col>
            </mu-row>
            <!--/TABS-->

            <!--- ARTIST --->
            <mu-list v-if="artist && mode==='artist'">
                <h6 class="topid">ARTIST : {{artist.id}}</h6>
                <mu-card style="width: 100%; margin: 0 auto;">
                    <mu-card-media :title="artist.name" :sub-title="'Artist'" v-if="artist.images.length>0">
                        <img :src="artist.images[0].url">
                    </mu-card-media>
                    <mu-card-text>
                        <mu-chip color="indigo500" class="range">
                            popularity&nbsp;<strong>{{artist.popularity}}</strong>
                        </mu-chip>

                        <mu-chip color="teal400" class="range">
                            followers&nbsp;<strong>{{artist.followers.total}}</strong>
                        </mu-chip>

                        <mu-chip color="cyan400" class="range" v-for="(genre,inx) in artist.genres" :key="'genre'+inx">
                            {{genre}}
                        </mu-chip>
                    </mu-card-text>
                </mu-card>
            </mu-list>
            <!---/ ARTIST --->

            <!--- ALBUM --->
            <mu-list v-if="album && mode==='album'">
                <h6 class="topid">ALBUM : {{album.id}}</h6>
                <mu-card style="width: 100%; margin: 0 auto;">
                    <mu-card-media :title="album.name" :sub-title="'Album'" v-if="album.images.length>0">
                        <img :src="album.images[0].url">
                    </mu-card-media>
                    <mu-card-text>
                        <mu-icon value="label" size="10"></mu-icon>&nbsp;{{album.label}}<br/>
                        <p style="margin:4px;" v-for="(cr,inx) in album.copyrights" :key="'cr'+inx">
                            <mu-icon value="copyright" size="10"></mu-icon>&nbsp;{{cr.text}}({{cr.type}})</p>
                        <mu-icon value="av_timer" size="10"></mu-icon>&nbsp;{{album.release_date}}
                    </mu-card-text>
                    <mu-card-text>
                        <mu-chip color="orange500" class="range">
                            popularity&nbsp;<strong>{{album.popularity}}</strong>
                        </mu-chip>

                        <mu-chip color="amber500" class="range">
                            total tracks&nbsp;<strong>{{album.total_tracks}}</strong>
                        </mu-chip>

                        <mu-chip color="brown500" class="range" v-for="(market,inx) in album.available_markets" :key="'markets'+inx">
                            {{market}}
                        </mu-chip>
                    </mu-card-text>
                </mu-card>

                <div v-if="album.tracks">
                    <mu-list-item avatar :ripple="false" button class="range" v-for="(item,inx) in album.tracks.items" :key="'album'+inx">
                        <mu-list-item-content @click="getTrack(item.id)">
                            <mu-list-item-title>{{item.name}}</mu-list-item-title>
                            <mu-list-item-sub-title>
                            <span v-if="item.artists">
                                 {{item.artists.map((a)=>a.name).join(' ')}}
                            </span>
                            </mu-list-item-sub-title>
                        </mu-list-item-content>
                        <mu-list-item-action>
                            <play-btn :id="item.id"/>
<!--                            <mu-icon value="play_circle_outline"></mu-icon>-->
                        </mu-list-item-action>
                    </mu-list-item>
                </div>


            </mu-list>
            <!---/ ALBUM --->

            <!--- TRACK --->
            <mu-list v-if="track && mode==='track'">
                <h6 class="topid">TRACK : {{track.id}}</h6>
                <h6 class="topid" style="color:#ff005b" v-if="track.external_ids">ISRC : {{track.external_ids.isrc}}</h6>
                <mu-list-item avatar :ripple="false" button class="range">
                    <mu-list-item-action v-if="track.album" style="position:relative;">
                        <mu-list-item-action class="playbtn2">
                            <play-btn :id="track.id"/>
                        </mu-list-item-action>

                        <mu-avatar v-if="track.album.images.length>0">
                            <img :src="track.album.images[0].url">
                        </mu-avatar>
                    </mu-list-item-action>

                    <mu-list-item-content>
                        <mu-list-item-title>{{track.name}}</mu-list-item-title>
                        <mu-list-item-sub-title>
                            <span v-if="track.artists">
                                 {{track.artists.map((a)=>a.name).join(' ')}}
                            </span>
                        </mu-list-item-sub-title>
                    </mu-list-item-content>
                    <mu-list-item-action @click="setRecoFeature(track.features)">
                        <mu-icon value="colorize"></mu-icon>
                    </mu-list-item-action>
                </mu-list-item>

                <mu-divider></mu-divider>
                    <mu-list-item button :ripple="false" class="range" @click="getAlbum(track.album.id)">
                        <mu-list-item-action>
                            <mu-icon value="album"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>&nbsp;{{track.album.name}}</mu-list-item-title>
                    </mu-list-item>
                <mu-divider></mu-divider>
                <!--ARTISTS-->
                <div v-if="track.artists">
                    <mu-list-item button :ripple="false" color="cyan100" class="range" v-for="(artist,inx) in track.artists" :key="'artist'+inx" @click="getArtist(artist.id)">
                        <mu-list-item-action>
                            <mu-icon value="mic"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>&nbsp;{{artist.name}}</mu-list-item-title>
                    </mu-list-item>
                </div>
                <!--/ARTISTS-->

                <!--Lyrics-->
                <mu-divider></mu-divider>

                <mu-list-item button :ripple="false" class="range" @click="trackLyricsByGenius(track.artists[0].name+' '+track.name)">
                    <mu-list-item-action>
                        <mu-icon value="translate" color="orange"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>&nbsp;Lyrics by Genius.com</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>

                <mu-list-item button :ripple="false" class="range" @click="trackLyricsByKGet()">
                    <mu-list-item-action>
                        <mu-icon value="translate" color="green"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>&nbsp;Lyrics by 歌詞GET</mu-list-item-title>
                </mu-list-item>
                <mu-divider></mu-divider>

                <mu-list-item button :ripple="false" class="range" @click="trackLyricsByMusixMatch(track.external_ids.isrc, track.name)" v-if="track.external_ids">
                    <mu-list-item-action>
                        <mu-icon value="translate" color="purple"></mu-icon>
                    </mu-list-item-action>
                    <mu-list-item-title>&nbsp;Lyrics by MusicBrainz+MusixMatch</mu-list-item-title>
                </mu-list-item>
                <!--/Lyrics-->
                <mu-divider></mu-divider>
                <!--FEATURES-->
                <div v-if="track.features">
                    <chart :type="'radar'" :data="seriesData(track.features)" :options="options" class="radar_chart" :height="300"></chart>
                    <mu-list>
                        <mu-list-item button :ripple="false" v-for="(feat,key,inx) in track.features" :key="key" class="range feature">
                            <mu-list-item-content>
                                <mu-list-item-title>{{key}} <span style="color:#0b7da3">{{feat}}</span></mu-list-item-title>
                            </mu-list-item-content>
                        </mu-list-item>

                        <mu-list-item button :ripple="false" class="range feature">
                            <mu-list-item-content>
                                <mu-list-item-title>popularity  <span style="color:#0b7da3">{{track.popularity}}</span></mu-list-item-title>
                            </mu-list-item-content>
                        </mu-list-item>
                    </mu-list>
                    <mu-divider></mu-divider>
                </div>
                <!--/FEATUERS-->
            </mu-list>
            <!---/ TRACK --->

            <!--- PLAYLIST --->
            <mu-list v-if="playlist && mode==='playlist'">
                <h6 class="topid">PLAYLIST : {{playlist.id}}</h6>

                <mu-form ref="filterform" :model="filter">
                    <mu-row gutter>
                        <mu-col span="2">
                            Filter?<mu-switch v-model="filter.use"></mu-switch>
                        </mu-col>
                        <mu-col span="10">
                            <mu-form-item :rules="emptyRules" prop="url">
                                <mu-select prop="url" v-model="filter.url" style="width:100%;" :disabled="!filter.use" @change="filterSelect">
                                    <mu-option v-for="(fil, inx) in spotify.filters" :key="'filter'+inx" :label="fil.url" :value="fil.url"></mu-option>
                                </mu-select>
                            </mu-form-item>
                        </mu-col>
                    </mu-row>

                    <!-- FILTER -->
                    <mu-row gutter v-if="filter.use">
                        <mu-col span="4" style="margin-bottom:6px;">
                            copyright?<mu-switch v-model="filter.checkcopyright"></mu-switch>
                        </mu-col>
                        <mu-col span="4" style="margin-bottom:6px;">
                            artistFreq?<mu-switch v-model="filter.checkartistfreq"></mu-switch>
                        </mu-col>
                        <mu-col span="4" style="margin-bottom:6px;">
                            <mu-text-field color="primary" placeholder="freq" v-model="filter.artistfreq" v-if="filter.checkartistfreq" class="range"/>
                        </mu-col>
                    </mu-row>

                    <mu-row gutter v-if="filter.use">
                        <mu-col span="12" style="margin-bottom:12px;">
                            <mu-button full-width color="indigo400" @click="filterAction">
                                <mu-icon value="filter_list"></mu-icon>&nbsp;FILTER
                            </mu-button>
                        </mu-col>
                    </mu-row>

                </mu-form>
                <!-- /FILTER -->

                <mu-card style="width: 100%; margin: 0 auto;">
                    <mu-card-media :title="playlist.name" :sub-title="'Playlist by '+playlist.owner.display_name" v-if="playlist.images.length>0">
                        <img :src="playlist.images[0].url">
                    </mu-card-media>
                    <mu-card-text v-html="playlist.description"></mu-card-text>
                </mu-card>

                <mu-tabs v-if="filter.use" :value.sync="filter.state" inverse color="secondary" text-color="rgba(0, 0, 0, .54)" center class="range">
                    <mu-tab> <p style="color:#20b4a6">all</p></mu-tab>
                    <mu-tab> <p style="color:#20b4a6">over</p></mu-tab>
                    <mu-tab> <p style="color:#ce8427">ng</p></mu-tab>
                    <mu-tab><p style="color:#c40043;">ng+over</p></mu-tab>
                    <mu-tab><p style="color:#70676a">ok</p></mu-tab>
                </mu-tabs>

                <!--Tracks in Playlist -->
                <mu-list-item avatar :ripple="false" button class="range playlist" v-for="(item,idx) in playlist.tracks.items" :key="'tdf'+idx" v-if="showTab(item)">

                    <mu-list-item-action @click="c_getTrack(item.track.id)" v-if="item.track.album">
                        <mu-avatar v-if="item.track.album.images.length>0">
                            <img :src="item.track.album.images[0].url">
                        </mu-avatar>
                    </mu-list-item-action>
                    <mu-list-item-content @click="getTrack(item.track.id)">
                        <mu-list-item-title>{{item.track.name}}</mu-list-item-title>
                        <mu-list-item-sub-title v-if="item.track.artists">
                            <span v-for="(a,inx) in item.track.artists" :key="'ai'+inx">
                                 {{a.name}}&nbsp;{{playlist.afreq && playlist.afreq[a.id] ? '('+playlist.afreq[a.id]+')' : ''}}
                            </span>
                        </mu-list-item-sub-title>

                        <div class="album_area" v-if="item.track.album.copyrights && filter.use" :class="{'filtered':item.filtered, 'over':c_isOver(item,filter)}">
                            {{item.track.album.copyrights.map((a)=> a.text).join(" ")}}
                        </div>

                    </mu-list-item-content>
                    <play-btn :id="item.track.id"/>
                </mu-list-item>

                <mu-row gutter v-if="filter.use">
                    <mu-col span="12" style="margin-bottom:12px;">
                        <mu-button full-width color="teal400" @click="c_downloadCSV(filter)">
                            <mu-icon value="cloud_download"></mu-icon>&nbsp;CSV
                        </mu-button>
                    </mu-col>
                </mu-row>
                <!--/Tracks in Playlist -->
            </mu-list>
            <!---/ PLAYLIST --->

            <!--- GENERATED --->
            <mu-list v-if="spotify.generated && mode==='generated'">
                <mu-list-item avatar :ripple="false" button class="range" v-for="(track,inx) in spotify.generated.tracks" :key="'gen'+inx">
                    <mu-list-item-action @click="c_getTrack(track.id)" v-if="track.album">
                        <mu-avatar v-if="track.album.images.length>0">
                            <img :src="track.album.images[0].url">
                        </mu-avatar>
                    </mu-list-item-action>
                    <mu-list-item-content @click="getTrack(track.id)">
                        <mu-list-item-title>{{track.name}}</mu-list-item-title>
                        <mu-list-item-sub-title>
                            <span v-if="track.artists">
                                 {{track.artists.map((a)=>a.name).join(' ')}}
                            </span>
                        </mu-list-item-sub-title>
                    </mu-list-item-content>
                    <mu-list-item-action>
                        <play-btn :id="track.id"/>
                    </mu-list-item-action>
                </mu-list-item>
            </mu-list>
            <!---/ GENERATED --->

            <!--- PODCAST(Show) --->
            <mu-list v-if="mode==='show'">

                    <h6 class="topid">SHOW : {{show.id}}</h6>
                    <mu-card style="width: 100%; margin: 0 auto;">

                        <mu-card-media :title="show.name" :sub-title="'Album'" v-if="show.images.length>0">
                            <img :src="show.images[0].url">
                            <mu-card-text>{{show.description}}</mu-card-text>
                        </mu-card-media>
                        <mu-card-text>
                            <mu-icon value="publisher" size="10"></mu-icon>&nbsp;{{show.publisher}}<br/>
                            <p style="margin:4px;" v-for="(cr,inx) in show.copyrights" :key="'cr'+inx">
                                <mu-icon value="copyright" size="10"></mu-icon>&nbsp;{{cr.text}}({{cr.type}})</p>
                            <p style="margin:4px;" v-for="(cr,inx) in show.languages" :key="'cr'+inx">
                                <mu-icon value="spellcheck" size="10"></mu-icon>&nbsp;{{cr}}</p>
                        </mu-card-text>
                        <mu-card-text>
                            <mu-chip color="brown500" class="range" v-for="(market,inx) in show.available_markets" :key="'markets'+inx">
                                {{market}}
                            </mu-chip>
                        </mu-card-text>
                    </mu-card>
            </mu-list>
            <!---/ PODCAST(Show)--->

            <!--- PODCAST(Episode) --->
            <mu-list v-if="episode && mode==='episode'">
                <h6 class="topid">EPISODE : {{episode.id}}</h6>
                <mu-card style="width: 100%; margin: 0 auto;">
                    <mu-card-media :title="episode.name" :sub-title="'Episode'" v-if="episode.images.length>0">
                        <img :src="episode.images[0].url">
                        <mu-card-text>{{episode.description}}</mu-card-text>
                    </mu-card-media>

                    <mu-card-text>
                        <mu-chip color="teal500" class="range">
                            <a :href="episode.audio_preview_url" target="_blank">AudioPreview</a>
                        </mu-chip>

                        <mu-divider></mu-divider>
                        <mu-icon value="access_time" size="10"></mu-icon>&nbsp;{{episode.duration_ms}}<br/>
                        <mu-icon value="label" size="10"></mu-icon>&nbsp;{{episode.language}}<br/>
                        <mu-icon value="av_timer" size="10"></mu-icon>&nbsp;{{episode.release_date}}
                    </mu-card-text>
                </mu-card>
            </mu-list>
            <!--- / PODCAST(Episode) --->

            <!--- LYRICS by GENIUS.com -->
            <mu-list v-if="genius.song && mode==='lyrics'">
                <h6 class="topid">LYRICS by[{{genius.song.type}}] {{genius.song.type ==='genius' ? 'geniusid' : 'isrc'}}:{{genius.song.id}}</h6>

                <div style="background-color:#a1a2c2;padding:5px;color:white;">
                    <h4 style="margin:6px 0;font-weight:bold;">{{genius.song.full_title}}</h4>
                    <p v-if="genius.song.primary_artist"><mu-icon value="mic"></mu-icon>&nbsp;{{genius.song.primary_artist.name}}</p>
                </div>
                <mu-icon value="music_note"></mu-icon>
                <pre v-html="genius.song.lyrics" style="background-color:#efefef; padding:0 12px;border-radius:6px;"></pre>
            </mu-list>
            <!--- / LYRICS --->
        </mu-container>
        <br>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../../mixins/spotify/index';
    import geniusMixin from '../../mixins/genius/index';
    import musixMixin from '../../mixins/musixmatch/index';
    import mysqlMixin from '../../mixins/mysql';
    import feedMixin from '../../mixins/feed/index';
    import utilMixin from '../../mixins/util';
    import {ruleEmpty} from '../../store/rules';

    import searchResList from '../List/SearchResList';
    import Chart from '../Chart/Chartjs';
    import PlayBtn from './PlayBtn';
    export default {
        name: "PlaylistView",
        mixins:[spotifyMixin,geniusMixin,musixMixin,mysqlMixin,feedMixin,utilMixin],
        components:{
          searchResList,
            Chart,
            PlayBtn
        },
        computed:{
            ...mapGetters(['spotify','genius','subscrib'])
        },
        created(){
            this.gen = this.spotify.gen
        },
        data () {
            return {
                emptyRules: [ruleEmpty],
                filter:{
                    url:null,
                    use:false,
                    checkcopyright:false,
                    checkartistfreq:false,
                    artistfreq:2,
                    state:0
                },

                mode:'playlist',
                gen:null,
                playlist:null,
                track:null,
                album:null,
                artist:null,
                episode:null,
                show:null,

                backgroundColor: [
                    '#1fc8db',
                    '#fce473',
                    '#42afe3',
                    '#ed6c63',
                    '#97cd76'
                ],

                labels:  ['Acousticness', 'Dance', 'Energy', 'Instrumental', 'Liveness', 'Speechiness', 'Valence'],
                options: {
                    segmentShowStroke: false,
                    tooltips: {
                        mode: 'label'
                    }
                }
            }
        },
        methods:{
            ...mapActions(['a_index','a_spotify','a_genius','a_subscrib']),

            showTab(item,state=null){
                let show = true;

                state = !!state ? state : this.filter.state;

                if(this.filter.use){
                   switch(state){
                       case 1:
                           //OVER
                           show = this.c_isOver(item,this.filter) && !item.filtered;
                           break;
                       case 2:
                           //NG
                           show = item.filtered && !(this.c_isOver(item,this.filter))
                           break;
                       case 3:
                           //NG+OVER
                           show = (this.c_isOver(item,this.filter) && item.filtered);
                           break;

                       case 4:
                           //OK
                           show = (!this.c_isOver(item,this.filter) && !item.filtered);
                           break;
                   }
                }
                return show;
            },

            trackLyricsByKGet(){
                this.getLyrics(
                    {
                        name:     this.track.name,
                        isrc:     this.track.external_ids.isrc,
                        id:       this.track.id,
                        artist:   this.track.artists ? this.track.artists[0].name :'',
                        artistid: this.track.artists ? this.track.artists[0].id : '',
                        thumb:    this.track.album.images ? this.track.album.images[0].url : ''
                    }, (res) => {
                        if (res){
                            this.a_genius(['set','song',{...res, type:'歌詞GET'}]);
                            this.a_spotify(['update', 'item', 'lyrics']);
                        }
                    });
            },

            trackLyricsByGenius(q){
                this.c_genius_lyrics(q, res=> {
                    console.log(res);
                    this.a_genius(['set','song',{...res, type:'genius'}]);
                    if(res) this.a_spotify(['update', 'item', 'lyrics']);
                })
            },

            trackLyricsByMusixMatch(isrc,track_name){
                this.c_mm_lyrics_isrc(isrc,track_name,res=>{
                    console.log(res);

                    if(res){
                        this.a_genius(['set','song',{
                            full_title:track_name,
                            lyrics:res.lyrics.lyrics_body,
                            id:isrc,type:'musixmatch'
                        }]);

                        this.a_spotify(['update', 'item', 'lyrics']);
                    }
                })
            },

            filterSelect(filter){
                axios.get(this.spotify.filter.proxy+filter)
                    .then((res)=>{
                        if(res.data) this.a_spotify(['filter','setBlacklist',res.data.blacklist]);
                    }).catch(error=>{console.log(error)})
            },

            filterAction(){
                this.$refs.filterform.validate().then((valid) => {
                    if(valid){
                        this.a_spotify(['set','playlist',this.playlist]);
                        if(!!this.playlist) this.c_filter(this.filter);
                    }
                });
            },

            setRecoFeature(features){
                this.$emit('leftopen');
              this.a_spotify(['set','feature',{popularity:this.track.popularity, val:features}]);

                this.c_getArtist(this.track.artists[0].id,(res)=>{

                   let seeds  = [{ type: 'TRACK',  id: this.track.id}, { type: 'ARTIST', id: this.track.artists[0].id}];
                   res.data.genres.forEach((genre)=> seeds.push({ type: 'GENRE', id: genre}));

                   this.a_spotify(['set','seeds',seeds.slice(0,5)]);
                });
            },
            getAlbum(id){
                this.c_getAlbum(id,(res)=>{
                    this.album = res.data;
                    console.log(this.album);
                    this.a_spotify(['update','item','album']);
                });
            },

            getArtist(id){
              this.c_getArtist(id,(res)=>{
                 this.artist = res.data;
                  this.a_spotify(['update','item','artist']);
              });
            },
            getTrack(id){
                this.c_getTrack(id,(res)=>{
                    this.track = res.data;
                    this.a_spotify(['update','item','track']);
                    this.a_spotify(['set','track',this.track]);
                })
            },


            seriesData (af) {
                let music_keys = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
                let af_data = [
                    [af.acousticness*100, af.danceability*100,af.energy*100, af.instrumentalness*100,af.liveness*100, af.speechiness*100, af.valence*100],
                ];

                let data = {
                    labels: this.labels
                };

                let af_series = [music_keys[af.mode]+" "+af.tempo+"bpm "+af.loudness+"dB"];

                data.datasets = af_series.map((e, i) => {
                    return {
                        data:                   af_data[i],
                        label:                  af_series,
                        borderColor:            this.spotify.backgroundColors[i],
                        pointBackgroundColor:   this.spotify.backgroundColors[i],
                        backgroundColor:        this.spotify.backgroundColors[i]
                    }
                });
                return data
            }
        },
        watch:{
            'spotify.update':{
                handler(newState){
                    //if(newState) this.$emit('open');

                    switch(newState.type){
                        case 'playlist':
                            this.mode = 'playlist';
                            this.c_getPlaylistById((res)=>{
                                if(res.data) this.playlist = res.data;
                            });
                            this.$emit('open');
                            break;
                        case 'track':
                            this.mode = 'track';
                            this.c_getTrack(this.spotify.track.id,(res)=>{
                                if(res.data) this.track = res.data;
                            });
                            this.$emit('open');
                            break;
                        case 'album':
                            this.mode = 'album';
                            this.c_getAlbum(this.spotify.album.id,(res)=>{
                                if(res.data) this.album = res.data;
                            });
                            this.$emit('open');
                            break;
                        case 'artist':
                            this.mode = 'artist';
                            this.c_getArtist(this.spotify.artist.id,(res)=>{
                                if(res.data) this.artist = res.data;
                            });
                            this.$emit('open');
                            break;
                        case 'generated':
                            this.mode = 'generated';
                            this.$emit('open');
                            break;
                        case 'lyrics':
                            this.mode = 'lyrics';
                            this.$emit('open');
                            break;
                        case 'episode':
                            this.mode = 'episode';
                            this.episode = this.spotify.episodes.items.filter(epi=>epi.id===this.spotify.episode.id)[0];
                            console.log("episode", this.episode);
                            this.$emit('open');
                            break;
                        case 'show':
                            this.mode = 'show';
                            this.show =  this.spotify.shows.items.filter(show=>show.id===this.spotify.show.id)[0];
                            console.log("show",this.show);
                            this.$emit('open');
                            break;
                    }
                },deep:true
            },
            'spotify.credential.access_token':{
                handler(newToken){
                    this.c_initplayer();
                }
            },

            'spotify.player':{
                handler(newState){

                    if(newState.playing){
                        //PLAY
                        this.c_devices((res)=>{
                            console.log("c_device",newState);
                            this.c_play(newState.nowid, newState.type, res.data.devices[0].id);
                        });
                    }else{
                        //STOP
                        this.c_pause();
                    }
                },deep:true
            }
        }
    }
</script>

<style scoped lang="scss">

    h6.topid{
        padding:10px 0 5px 0;
        letter-spacing: 0.03rem;
        color: #0495dc;
    }

    .playbtn2 {
        position: absolute;
        top: 8px;
        left: 7px;
        width: 40px;
        height: 40px;
        text-align: center;
        .mu-item-action{
            color: white !important;
            .mu-icon {
                color: white !important;
            }
        }
    }

</style>
