<template>
    <mu-container class="flex_v">
        <div class="base" style="text-align:center;">
            <h1>
                <mu-icon value="filter_list"></mu-icon>&nbsp;FILTER!
            </h1>
            <mu-form ref="filterform" :model="spotify.searchQuery" class="mu-demo-form" label-position="left" label-width="100">

                <div v-if="spotify.credential.expires_in">

                    <mu-row gutter>
                        <mu-col span="12">
                            <mu-form-item prop="filtertype" label="種類" class="sixteen wide mobile">
                                <mu-select prop="filtertype" v-model="filter.url" color="primary">
                                    <mu-option v-for="(filter, index) in spotify.filters" :key="'filter'+index" :label="filter.name" :value="filter.url"></mu-option>
                                </mu-select>
                            </mu-form-item>
                        </mu-col>
                    </mu-row>

                    <mu-row gutter>
                        <mu-col span="12">

                            <mu-form-item prop="textarea" label="PlaylistID" class="sixteen wide mobile">
                                {{spotify.playlist.id ? spotify.playlist.id : 'まだPlaylist IDが選ばれていません。左のサイドバーから選んでください。'}}
                            </mu-form-item>
                        </mu-col>
                    </mu-row>
                </div>
                <div style="height:80px;" v-else></div>
                <mu-row gutter>
                    <mu-col span="12" sm="12" md="12" lg="12" xl="12">
                        <div class="grid-cell">
                            <mu-button color="primary" class="smallbtn" full-width @click="c_getCredential" v-if="!spotify.credential.expires_in">LOGIN</mu-button>
                            <mu-button color="secondary" class="smallbtn" full-width v-else :disabled="!spotify.playlist.id" @click="c_filter">FILTER</mu-button>
                        </div>
                    </mu-col>
                </mu-row>

            </mu-form>
        </div>
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify/index';
    export default {
        name: 'myfilters',
        mixins:[spotifyMixin],
        data(){
          return{

              filter:{
                  url:null
              }
          }
        },
        methods:mapActions(['a_spotify']),
        computed:mapGetters(['spotify']),
        mounted(){
            this.filter = this.spotify.filter;
        },
        watch:{
            'spotify.credential':{
                handler(){
                    if(!!this.spotify.credential.expires_in) this.c_getMe();
                },
                deep:true
            },
            'spotify.filter':{
                handler(newFilter){
                    this.filter = newFilter;
                    this.$nextTick(()=> this.$refs.filterform.validate())
                },deep:true
            },
        }
    }
</script>
