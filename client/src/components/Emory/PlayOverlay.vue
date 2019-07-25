<template>
        <mu-flex justify-content="center" align-items="center" direction="column">

            <div class="animearea" v-if="shapes">
                <anime-control :shapes="shapes.shapes"></anime-control>
            </div>
            <md-button class="md-orange md-round" style="margin-bottom:18px;padding-bottom:8px;" @click="playStop">終了</md-button>

        </mu-flex>
</template>

<script>
    import spotifyMixin from '../../mixins/spotify';
    import utilMixin from '../../mixins/util';
    import mapMixin from '../../mixins/map';
    import {mapGetters, mapActions} from 'vuex';

    import {PricingCard} from '../../components/MD/index';
    import MyAvatar from '../../components/Map/MyAvatar';
    import AnimeControl from '../../components/Svg/AnimeControl';


    import axios from 'axios';


    export default {
        name: "PlayOverlay",
        mixins:[
            spotifyMixin,
            utilMixin,
            mapMixin
        ],
        components:{
            MyAvatar,
            PricingCard,
            AnimeControl
        },
        data(){
            return{
                shapes:null
            }
        },
        computed: {
            ...mapGetters([
                'spotify',
                'mapstore',
                'loggedIn'])
        },
        mounted(){
            axios.get("/static/data/emory_svg_shape.json").then(res => this.shapes = res.data)
        },
        methods: {
            ...mapActions([
                'a_mapstore',
                'a_index'
            ]),

            playStart(){
                this.a_mapstore(['set', 'tracking', true]);
                this.a_mapstore(['set','mode','map']);
                this.a_index(['storyModal','toggle',true]);
            },

            playStop(){
                this.a_mapstore(['set', 'tracking', false]);
                this.a_mapstore(['set','mode','info']);
                this.a_index(['storyModal','toggle',false]);
            }
        }
    }
</script>

<style scoped>
    .animearea{
        overflow:hidden;
        margin-top: 60px;
        align-items: center;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;


    }

</style>
