<template>
        <mu-flex justify-content="center" align-items="center" direction="row">

            <pricing-card class="md-card-background" :card-image="mapstore.emory.projects[mapstore.emory.project.id].thumb" style="max-width:320px;width:80%;" v-if="mapstore.emory.project.id">
                <template slot="cardContent" v-if="mapstore.emory.projects[mapstore.emory.project.id]">
                    <h6 class="card-category text-success">PLAY</h6>
                    <h3 class="card-title">
                        {{mapstore.emory.projects[mapstore.emory.project.id].title}}
                    </h3>

                    <p class="card-description">
                       {{mapstore.emory.projects[mapstore.emory.project.id].desc}}
                    </p>

                    <ul>
                        <li>
                            <md-icon class="text-success">check</md-icon>有効範囲の選択
                        </li>
                        <li>
                            <mu-select class="white" prop="triggerDist" :value="mapstore.emory.triggerDist" @change="(val)=>a_mapstore(['emory','setTriggerDist',val])" style="margin-bottom:0;padding-bottom:0;">
                                <mu-option  label="8m" :value="8"></mu-option>
                                <mu-option  label="10m" :value="10"></mu-option>
                                <mu-option  label="20m" :value="20"></mu-option>
                                <mu-option  label="30m" :value="30"></mu-option>
                                <mu-option  label="50m" :value="50"></mu-option>
                                <mu-option  label="80m" :value="80"></mu-option>
                            </mu-select>
                        </li>

                        <li v-if="mapstore.mainuser">
                            <my-avatar :marker="marker" :id="marker.id" v-for="(marker,id) in m_sortedMarkers" :key="'mv'+id"></my-avatar>
                        </li>
                    </ul>

                    <md-button class="md-primary md-round"  @click="playStart" v-if="mapstore.emory.projects[mapstore.emory.project.id]">プレイ開始</md-button>
                    <md-button class="md-primary md-round"  @click="a_mapstore(['set','mode','info'])">メニューへ</md-button>

                </template>
            </pricing-card>



        </mu-flex>
</template>

<script>
    import spotifyMixin from '../../mixins/spotify';
    import utilMixin from '../../mixins/util';
    import mapMixin from '../../mixins/map';
    import {mapGetters, mapActions} from 'vuex';

    import {PricingCard} from '../../components/MD/index';
    import MyAvatar from '../../components/Map/MyAvatar';
    export default {
        name: "PlayOverlay",
        mixins:[
            spotifyMixin,
            utilMixin,
            mapMixin
        ],
        components:{
            MyAvatar,
            PricingCard
        },
        computed: {
            ...mapGetters([
                'spotify',
                'mapstore',
                'loggedIn'])
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
        }
    }
</script>

<style scoped>

</style>
