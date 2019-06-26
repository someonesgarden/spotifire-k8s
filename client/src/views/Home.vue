<template>
    <mu-container class="flex_v">

        <div class="home_inner">

            <img class="emory_logo" src="/static/img/logos/spotifire_experiments_b.png"/>

            <div class="ui grid" style="margin-left:0;margin-right:0;margin-bottom:0;">
                <div class="sixteen wide mobile eight wide tablet eight wide computer column">
                    <mu-button class="menu_btns" color="black" full-width to="/emory"
                               style="background-image:url('/static/img/banners/emory_home.jpg');">
                        EMORY(map)
                    </mu-button>
                </div>
                <div class="sixteen wide mobile eight wide tablet eight wide computer column">
                    <mu-button class="menu_btns" color="black" full-width
                               style="opacity:0.20;">
                    </mu-button>
                </div>
            </div>


        </div>
    </mu-container>
</template>
<script>
    import {mapGetters,mapActions} from 'vuex';
    import spotifyMixin from '../mixins/spotify';
    import utilMixin from '../mixins/util';

    export default {
        name: 'home',
        mixins:[spotifyMixin,utilMixin],
        computed:mapGetters(['pwa','loggedIn','spotify']),
        methods:{
            ...mapActions(['a_index']),
            // goMap(login,to='/map'){
            //     if(this.loggedIn){
            //         if(login && !this.spotify.credential.expires_in){
            //             this.c_getCredential();
            //         }else{
            //             this.a_spotify(['set','me',{id:'GUEST'}]);
            //         }
            //         this.$router.push(to);
            //     }
            // }
        },

    }
</script>
<style lang="scss">
    .home_inner {
        width:100%;
        position:relative;
        text-align: center;
        border-radius: 5px;
        background-color: rgba(255, 255, 255, 0.38);
        padding: 12px 12px;
        margin: 80px 8px 8px 8px;

        img.emory_logo {
            height: auto;
            max-width: 220px;
            margin: 8px auto;
        }

        img.spotify_logo{
            height:25px;
            border-radius:4px;
            display:inline;
        }

        p {
            line-height: 1.2rem;
            /*background-color: white;*/
            padding: 12px;
            border-radius: 8px;
        }

        .menu_btns, .menu_btns.hover{
            background-size:cover;
            background-position:center center;
            height:60px;
            margin:10px auto;
            .mu-button-wrapper{
                font-weight:bold;
                font-size:1.2rem;
                letter-spacing: 0.42rem;
                color:white;
            }
        }

    }
</style>
