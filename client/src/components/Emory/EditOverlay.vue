<template>
    <mu-flex justify-content="center" align-items="center" direction="row">

        <pricing-card style="box-shadow:none !important;max-width:450px;width:76%;margin:8px auto;">
            <template slot="cardContent">
                <h4 class="card-category" style="font-weight:bold;">
                    <span v-if="mapstore.emory.editing.type==='marker'">マーカーの作成・編集</span>
                    <span v-else>プロジェクトの作成・編集</span>
                </h4>

                <h4 v-if="!mapstore.emory.marker.center">「編集」で表示される地図をクリックすると座標選択できます。</h4>
                <p v-else>このポイントを保存する場合は「保存」を押してください。</p>
                <br>

                <!--Edit Marker-->
                <mu-form :model="mapstore.emory.marker" ref="marker" label-width="100" class="range edit_form"
                         v-if="mapstore.emory.marker.center && mapstore.emory.editing.type==='marker'">
                    <img :src="mapstore.emory.marker.thumb" style="width:80px;height:auto;margin:5px auto;" v-if="mapstore.emory.marker.thumb"/>

                    <div class="ui grid" style="margin-left:0;margin-right:0;margin-bottom:0;">
                        <div class="five wide mobile fix wide tablet fix wide computer column"  style="padding:10px 0 0 0;">

                            <mu-form-item prop="markertype" :rules="blankRules">
                                <mu-select prop="markertype" color="primary"
                                           v-model="mapstore.emory.marker.markertype"
                                           @change="(val)=>m_emoryParam('markertype',val,'marker')">
                                    <mu-option  label="podcast" value="pod"></mu-option>
                                    <mu-option  label="mp3"     value="mp3"></mu-option>
                                    <mu-option  label="track" value="track"></mu-option>
                                </mu-select>
                            </mu-form-item>
                        </div>

                        <div class="four wide mobile four wide tablet four wide computer column" style="padding:10px 0 0 0;">

                            <mu-form-item prop="triggerDist" :rules="blankRules">
                                <mu-select prop="triggerDist" color="primary"
                                           v-model="mapstore.emory.marker.triggerDist"
                                           @change="(val)=>m_emoryParam('triggerDist',val,'marker')">
                                    <mu-option  label="5m"      value="5"></mu-option>
                                    <mu-option  label="10m"     value="10"></mu-option>
                                    <mu-option  label="15m"     value="15"></mu-option>
                                    <mu-option  label="20m"     value="20"></mu-option>
                                    <mu-option  label="25m"     value="25"></mu-option>
                                    <mu-option  label="30m"     value="30"></mu-option>
                                    <mu-option  label="35m"     value="35"></mu-option>
                                    <mu-option  label="40m"     value="40"></mu-option>
                                    <mu-option  label="45m"     value="45"></mu-option>
                                    <mu-option  label="50m"     value="50"></mu-option>
                                </mu-select>
                            </mu-form-item>
                        </div>

                        <div class="seven wide mobile seven wide tablet seven wide computer column"  style="padding:10px 0 0 0;">
                            <mu-form-item prop="type" :rules="blankRules">
                                <mu-select prop="type" color="primary"
                                           v-model="mapstore.emory.marker.type"
                                           @change="(val)=>m_emoryParam('type',val,'marker')">
                                    <mu-option  label="スポット"  value="spot"></mu-option>
                                    <mu-option  label="人"       value="person"></mu-option>
                                    <mu-option  label="その他"    value="other"></mu-option>
                                </mu-select>
                            </mu-form-item>
                        </div>
                    </div>


                    <div class="ui grid" style="margin-left:0;margin-right:0;margin-bottom:10px;">
                        <div class="three wide mobile three wide tablet three wide computer column"
                             style="padding:10px 0 0 0;margin-top:5px;">
                            <mu-form-item prop="loop">
                                <mu-checkbox label="loop"
                                             v-model="mapstore.emory.marker.loop"
                                             @change="(val)=>m_emoryParam('loop',val,'marker')"></mu-checkbox>
                            </mu-form-item>
                        </div>

                        <div class="thirteen wide mobile thirteen wide tablet thirteen wide computer column"
                             style="padding:10px 0 0 0;">
                            <mu-form-item prop="title" :rules="blankRules">
                                <mu-text-field prop="title" placeholder="マーカーのタイトル"
                                               v-model="mapstore.emory.marker.title"
                                               @change="(val)=>m_emoryParam('title',val,'marker')"></mu-text-field>
                            </mu-form-item>
                        </div>
                    </div>

                    <mu-form-item prop="desc" :rules="blankRules">
                        <mu-text-field prop="desc" placeholder="メモ（20文字以内）"
                                       v-model="mapstore.emory.marker.desc"
                                       @change="(val)=>m_emoryParam('desc',val,'marker')"></mu-text-field>
                    </mu-form-item>

                    <div class="ui grid" style="margin-left:0;margin-right:0;margin-bottom:10px;">

                        <div class="three wide mobile three wide tablet three wide computer column" style="padding:10px 0 0 0;margin-top:5px;">
                            <mu-form-item prop="public">
                                <mu-checkbox :label="mapstore.emory.marker.public ? '公開' : '非公開'"
                                             v-model="mapstore.emory.marker.public"
                                             @change="(val)=>m_emoryParam('public',val,'marker')"></mu-checkbox>
                            </mu-form-item>
                        </div>

                        <div class="thirteen wide mobile thirteen wide tablet thirteen wide computer column"  style="padding:10px 0 0 0;"
                             v-if="mapstore.emory.marker.markertype==='pod'">
                            <mu-form-item prop="spotifyid" :rules="blankRules">
                                <mu-select prop="spotifyid" color="primary" v-if="spotify.episodes"
                                           v-model="mapstore.emory.marker.spotifyid"
                                           @change="(val)=>m_emoryParam('spotifyid',val,'marker')">
                                    <mu-option  :label="epi.name" :value="epi.id" v-for="(epi,inx) in spotify.episodes.items" :key="'epi'+inx"></mu-option>
                                </mu-select>
                                <mu-text-field prop="spotifyid" placeholder="Episode ID"
                                               v-model="mapstore.emory.marker.spotifyid"
                                               @change="(val)=>m_emoryParam('spotifyid',val,'marker')"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="thirteen wide mobile thirteen wide tablet thirteen wide computer column" style="padding:10px 0 0 0;"
                             v-else-if="mapstore.emory.marker.markertype==='mp3'">
                            <mu-form-item prop="mp3" :rules="blankRules">
                                <mu-text-field prop="mp3" placeholder="mp3 URL(https)"
                                               v-model="mapstore.emory.marker.mp3"
                                               @change="(val)=>m_emoryParam('mp3',val,'marker')"></mu-text-field>
                            </mu-form-item>
                        </div>

                        <div class="thirteen wide mobile thirteen wide tablet thirteen wide computer column" style="padding:10px 0 0 0;"
                             v-else>
                            <mu-form-item prop="spotifyid" :rules="blankRules">
                                <mu-text-field prop="spotifyid" placeholder="Spotify ID"
                                               v-model="mapstore.emory.marker.spotifyid"
                                               @change="(val)=>m_emoryParam('spotifyid',val,'marker')"></mu-text-field>
                                <mu-select prop="spotifyid" color="primary" v-if="spotify.tracks"
                                           v-model="mapstore.emory.marker.spotifyid"
                                           @change="(val)=>m_emoryParam('spotifyid',val,'marker')">
                                    <mu-option  :label="track.name" :value="track.id" v-for="(track,inx) in spotify.tracks.items" :key="'track'+inx"></mu-option>
                                </mu-select>
                            </mu-form-item>
                        </div>
                    </div>

                    <mu-flex justify-content="center" align-items="center" direction="row">
                        <mu-button color="red"  class="smallbtn" @click="delAlert.marker=true" v-if="mapstore.emory.marker.id"><mu-icon value="delete_forever" :size="20"></mu-icon>&nbsp;削除</mu-button>
                        <mu-button color="info" class="smallbtn" @click="saveNewPoint('marker')"  v-if="mapstore.emory.marker.center"><mu-icon value="save" :size="20"></mu-icon>&nbsp;保存</mu-button>
                    </mu-flex>
                </mu-form>
                <!--//Edit Marker-->

                <!--Edit Project-->
                <mu-form :model="mapstore.emory.project" ref="project" :label-position="'top'" label-width="100" v-if="mapstore.emory.project.center && mapstore.emory.editing.type==='project'" class="range edit_form">
                    <img :src="mapstore.emory.project.thumb" v-if="mapstore.emory.project.thumb">
                    <mu-text-field prop="thumb" placeholder="プロジェクトの画像"  v-if="mapstore.emory.project.thumb"
                                   v-model="mapstore.emory.project.thumb"
                                   @change="(val)=>m_emoryParam('thumb',val,'project')"></mu-text-field>

                    <mu-form-item prop="title" :rules="blankRules">
                        <mu-text-field prop="title" placeholder="プロジェクトのタイトル"
                                       v-model="mapstore.emory.project.title"
                                       @change="(val)=>m_emoryParam('title',val,'project')"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="desc" :rules="blankRules">
                        <mu-text-field prop="desc" placeholder="プロジェクトの概要(100文字程度）" multi-line :rows="2"
                                       v-model="mapstore.emory.project.desc"
                                       @change="(val)=>m_emoryParam('desc',val,'project')"></mu-text-field>
                    </mu-form-item>
                    <mu-form-item prop="spotifyid" :rules="blankRules">
                        <mu-text-field prop="spotifyid" placeholder="Spotify ID"
                                       v-model="mapstore.emory.project.spotifyid"
                                       @change="(val)=>m_emoryParam('spotifyid',val,'project')"></mu-text-field>
                        <mu-select prop="spotifyid" color="primary"
                                   v-if="spotify.playlists"
                                   v-model="mapstore.emory.project.spotifyid"
                                   @change="(val)=>m_emoryParam('spotifyid',val,'project')">
                            <mu-option  :label="pro.name" :value="pro.id" v-for="(pro,inx) in spotify.playlists.items" :key="'pro'+inx"></mu-option>
                        </mu-select>

                    </mu-form-item>

                    <mu-flex justify-content="center" align-items="center" direction="row">
                        <mu-button color="red" class="smallbtn" @click="delAlert.project=true" v-if="mapstore.emory.project.id"><mu-icon value="delete_forever" :size="20"></mu-icon>&nbsp;削除</mu-button>
                        <mu-button color="info" class="smallbtn" @click="saveNewPoint('project')" v-if="mapstore.emory.project.center"><mu-icon value="save" :size="20"></mu-icon>&nbsp;保存</mu-button>
                    </mu-flex>
                </mu-form>
                <!--//Edit Project-->

                <mu-flex justify-content="center" align-items="center" direction="row">
                    <mu-button color="indigo400" class="smallbtn" @click="m_editMap('project')">プロジェクト編集</mu-button>
                    <mu-button color="indigo600" class="smallbtn" @click="m_editMap('marker')">マーカー編集</mu-button>
                    <mu-button color="indigo800" class="smallbtn" @click="m_endEditing">終了</mu-button>
                </mu-flex>

                <mu-dialog title="マーカーを削除する" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open="delAlert.marker">
                    <p>決定をクリックすると削除されます。この処理は取り消せません。<br/>削除しない場合は「キャンセル」を押してください。</p>
                    <mu-button slot="actions" flat color="primary" @click="delAlert.marker=false">キャンセル</mu-button>
                    <mu-button slot="actions" flat color="primary" @click="delFirebase(firebaseDB.marker,mapstore.emory.marker.id)">決定</mu-button>
                </mu-dialog>

                <mu-dialog title="プロジェクトを削除する" width="600" max-width="80%" :esc-press-close="false" :overlay-close="false" :open="delAlert.project">
                    <p>決定をクリックすると削除されます。この処理は取り消せません。<br/>削除しない場合は「キャンセル」を押してください。</p>
                    <mu-button slot="actions" flat color="primary" @click="delAlert.project=false">キャンセル</mu-button>
                    <mu-button slot="actions" flat color="primary" @click="delFirebase(firebaseDB.project,mapstore.emory.project.id)">決定</mu-button>
                </mu-dialog>
            </template>
        </pricing-card>

    </mu-flex>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import spotifyMixin from '../../mixins/spotify';
    import mapMixin from '../../mixins/map';
    import utilMixin from '../../mixins/util';
    import wsMixin from '../../mixins/ws';
    import {ruleEmpty} from '../../store/rules';

    import {PricingCard} from '../../components/MD/index';
    import M from '../../class/map/EMarker';
    import P from '../../class/map/EProject';

    let nulls = {
        marker:new M({}).marker,
        project:new P({}).project
    };

    const nullmarker = new M({}).marker;
    const nullproject = new P({}).project;

    export default {
        name: "EditOverlay",
        mixins: [
            spotifyMixin,
            mapMixin,
            wsMixin,
            utilMixin
        ],
        components:{
            PricingCard
        },
        props:['firebaseDB'],
        data(){
            return{
                delAlert:{
                    marker:false,
                    project:false
                },
                blankRules: [ruleEmpty],
            }
        },
        computed:mapGetters(['spotify', 'mapstore', 'loggedIn']),
        methods: {
            ...mapActions(['a_index', 'a_spotify', 'a_mapstore']),

            delFirebase(ref,id){
                ref.child(id).remove();
                this.m_cancelEditMode();
                this.delAlert.marker = false;
                this.delAlert.project = false;
            },

            saveNewPoint(type='marker'){
                this.$refs[type].validate().then(valid => {
                    if(!valid || !this.mapstore.emory[type].center) return;
                    if(this.mapstore.emory[type].center.lat === 34.722677123) return; //初期座標のままだと終了

                    if (type === 'marker') {
                        this.a_mapstore(['emory', 'setprojectid', this.mapstore.emory.project.id]);

                        new M(this.mapstore.emory[type]).updateOrNew(this.firebaseDB[type]);
                        this.a_mapstore(['emory', type, nulls[type]]);  // フォームの初期化
                    }
                    else if (type === 'project') {
                        this.m_emoryParam('zoom', 20, 'project');

                        let newProj = new P(this.mapstore.emory[type]).updateOrNew(this.firebaseDB[type]);

                        console.log(newProj);

                        this.a_mapstore(['emory', type, nulls[type]]);  // フォームの初期化
                    }


                    this.m_cancelEditMode();
                });
            }
        }
    }
</script>
