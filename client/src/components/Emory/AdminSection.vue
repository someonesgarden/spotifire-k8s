<template>

    <mu-flex justify-content="center" align-items="center" direction="row">

        <div class="md-layout tight light">
            <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100" v-if="!spotify.me.id">
                <mu-button color="teal500" class="smallbtn" full-width @click="m_goMap(true)">
                   <md-icon>check_circle</md-icon>&nbsp;Spotifyにログイン
                </mu-button>
            </div>
            <div class="md-layout-item md-medium-size-50 md-small-size-50 md-xsmall-size-100" v-if="!spotify.me.id">
                <mu-button color="orange700" class="smallbtn" full-width @click="m_goMap(false)">
                    <md-icon>exit_to_app</md-icon>&nbsp;ログインせず使用
                </mu-button>
            </div>

            <div class="md-layout-item md-medium-size-100 md-small-size-100 md-xsmall-size-100" v-else>
                <div class="usercard login" v-if="spotify.credential.expires_in">
                    <mu-avatar slot="avatar" style="border:2px solid white;">
                        <img :src="avatar_thumb">
                    </mu-avatar>
                    <div class="title">{{spotify.me.id}}</div>
                    <div class="subtitle">Spotifyにログイン中</div>
                </div>
                <div class="usercard" v-else>
                    <div class="title">GUEST USER</div>
                    <div class="subtitle">ログインしていません。</div>
                    <div class="key_btn" @click="c_getCredential">
                        <mu-icon value="vpn_key" :size="18"></mu-icon>
                    </div>
                </div>
            </div>

            <div class="md-layout tight">
                <div class="md-layout-item md-size-100 mx-auto md-xsmall-size-100 text-center">
                    <mu-button color="orange700" class="smallbtn md-sm" full-width @click="goEdit">
                        <md-icon>build</md-icon>
                    </mu-button>
                    <div>
                        <span style="color:white;">ユーザー有効範囲</span>
                        <mu-select prop="triggerDist" class="white" style="margin-bottom:0;padding-bottom:0;"
                                   :value="mapstore.emory.triggerDist"
                                   @change="(val)=>a_mapstore(['emory','setTriggerDist',val])">
                            <mu-option label="なし" :value="0"></mu-option>
                            <mu-option label="8m" :value="8"></mu-option>
                            <mu-option label="10m" :value="10"></mu-option>
                            <mu-option label="20m" :value="20"></mu-option>
                            <mu-option label="30m" :value="30"></mu-option>
                            <mu-option label="50m" :value="50"></mu-option>
                            <mu-option label="80m" :value="80"></mu-option>
                            <mu-option label="100m" :value="100"></mu-option>
                        </mu-select>
                    </div>

                    <div>
                        <span style="color:white;">サーチ範囲</span>
                        <mu-select prop="searchDist" class="white" style="margin-bottom:0;padding-bottom:0;"
                                   :value="mapstore.emory.searchDist"
                                   @change="(val)=>a_mapstore(['emory','setSearchDist',val])">

                            <mu-option label="50m" :value="50"></mu-option>
                            <mu-option label="100m" :value="100"></mu-option>
                            <mu-option label="200m" :value="200"></mu-option>
                            <mu-option label="300m" :value="300"></mu-option>
                            <mu-option label="500m" :value="500"></mu-option>
                            <mu-option label="1km" :value="1000"></mu-option>
                            <mu-option label="10km" :value="10000"></mu-option>
                        </mu-select>
                    </div>
                </div>
            </div>

        </div>

    </mu-flex>

</template>

<script>
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../../mixins/spotify';
    import utilMixin    from '../../mixins/util';
    export default {
        name: "AdminSection",
        mixins:[spotifyMixin,utilMixin],
        computed:{
            ...mapGetters([
                'spotify',
                'mapstore',
                'loggedIn']),
            avatar_thumb(){
                return this.spotify.bookmarks ? this.spotify.bookmarks[0].album.images[0].url : '/static/img/markers/edit/m_mainuser_1.png'
            }
        },
        methods: {
            ...mapActions([
                'a_index',
                'a_spotify',
                'a_mapstore']),

            goEdit(){
                //管理機能の中にはplaylist登録などもあるので、ログインしていない場合はログインさせる。
                if(!this.spotify.credential.expires_in) this.c_getCredential();
                this.m_scrollTo('#app');
                this.a_mapstore(['set','mode','edit']);
            }
        }
    }
</script>
