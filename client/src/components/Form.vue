<template>
    <mu-container>
        <div style="padding:90px 20px; width:100%;">

        <mu-form :model="form" class="mu-demo-form" label-position="left" label-width="100">

            <mu-form-item prop="input" label="User" v-if="spotify.credential.expires_in">
                <mu-text-field :value="spotify.me.id" @change="meIdChange"></mu-text-field>
            </mu-form-item>

            <mu-form-item prop="select" label="Select" v-if="spotify.playlists">
                <mu-select :value="spotify.playlist" @change="playlistSelected">
                    <mu-option v-for="(plist, index) in spotify.playlists" :key="'plist'+index" :label="plist.name" :value="plist.id"></mu-option>
                </mu-select>
            </mu-form-item>


            <mu-form-item prop="radio" label="Action">
                <mu-radio v-model="form.action" value="search" label="Search"></mu-radio>
                <mu-radio v-model="form.action" value="other" label="Other"></mu-radio>
            </mu-form-item>


            <mu-form-item prop="checkbox" label="Types">
                <mu-checkbox v-model="form.datatypes" value="album" label="Album"></mu-checkbox>
                <mu-checkbox v-model="form.datatypes" value="artist" label="Artist"></mu-checkbox>
                <mu-checkbox v-model="form.datatypes" value="playlist" label="Playlist"></mu-checkbox>
                <mu-checkbox v-model="form.datatypes" value="track" label="Track"></mu-checkbox>
                <mu-checkbox v-model="form.datatypes" value="episode" label="Episode"></mu-checkbox>
                <mu-checkbox v-model="form.datatypes" value="show" label="Show"></mu-checkbox>
            </mu-form-item>
            <mu-form-item prop="limit" label="Limit">
                <mu-slider v-model="form.limit"></mu-slider>
            </mu-form-item>


            <mu-form-item prop="textarea" label="Textarea">
                <mu-text-field multi-line :rows="1" :rows-max="2" v-model="form.textarea"></mu-text-field>
            </mu-form-item>

            <mu-row gutter>
                <mu-col span="12" sm="4" md="4" lg="3" xl="5">
                    <div class="grid-cell">
                        <mu-button color="primary" class="smallbtn" full-width @click="c_getCredential" v-if="!spotify.credential.expires_in">
                            Credential
                        </mu-button>
                        <mu-button color="secondary" class="smallbtn" full-width @click="c_refreshCredential" v-else>
                            Logged In
                        </mu-button>
                    </div>
                </mu-col>

                <mu-col span="12" sm="4" md="4" lg="3" xl="3" v-if="spotify.credential.expires_in">
                    <div class="grid-cell">
                    <mu-button color="teal300" class="smallbtn" full-width @click="c_getMe">
                        ME
                    </mu-button>
                    </div>
                </mu-col>

                <mu-col span="12" sm="4" md="4" lg="3" xl="3" v-if="spotify.credential.expires_in">
                    <div class="grid-cell">
                        <mu-button color="lime500" class="smallbtn" full-width @click="c_getMyPlaylists">
                            PLaylists
                        </mu-button>
                    </div>
                </mu-col>

            </mu-row>
        </mu-form>
        </div>
    </mu-container>
</template>
<script>
    import {mapGetters} from 'vuex';
    import commonMixin from '../mixins/spotify/index';
    export default {
        name: 'myform',
        mixins:[commonMixin],
        data: function () {
            return {
                form: {
                    action: 'search',
                    datatypes: [],
                    limit: 30,
                    textarea: ''
                }
            }
        },

        methods:{
            meIdChange(val){
                this.a_spotify(['set','meId',val]);
            },

            playlistSelected(val){
                this.a_spotify(['set','playlistID',val]);
            }
        },

        computed:mapGetters(['spotify']),

        watch:{
            'spotify.credential':{
                handler(newData){
                    console.log('spotify.credential changed!');
                    console.log(newData);
                    if(!!this.spotify.credential.expires_in) this.c_getMe();
                },
                deep:true
            }
        }
    }
</script>

<style scoped lang="scss">
</style>
