<template>
    <div id="HeaderTop" class="nav-header">

        <!-- AppBar Normal -->
        <mu-appbar class="appbar-normal mu-appbar-header" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="menu.normal">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/spotifire/logos/black_red.png" style="width:110px; height:auto;"/>
                </mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('normal')">
                    <mu-list-item button to="/emory">
                        <mu-list-item-title>
                            <md-icon>extension</md-icon>
                            &nbsp;Emory</mu-list-item-title>
                    </mu-list-item>

<!--                    <mu-list-item button to="/routetrack">-->
<!--                        <mu-list-item-title>-->
<!--                            <md-icon>extension</md-icon>-->
<!--                            &nbsp;RouteTrack</mu-list-item-title>-->
<!--                    </mu-list-item>-->
                    <mu-divider></mu-divider>

                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="a_index(['side','left',{key:'spotify',val:true}])">
                <md-icon>border_left</md-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <md-icon>border_bottom</md-icon>
            </mu-button>
            <mu-button flat slot="right" @click="a_index(['side','right',{key:'spotify',val:true}])">
                <md-icon>border_right</md-icon>
            </mu-button>
        </mu-appbar>

        <!-- AppBar Emory -->
        <mu-appbar class="appbar-emory mu-appbar-header" color="blueGrey900" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="menu.map">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/emory/logos/horizontal_w.png" style="width:110px; height:auto;">
                </mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('map')">
                    <mu-list-item button to="/">
                        <mu-list-item-title>
                            <md-icon>home</md-icon>&nbsp;トップ</mu-list-item-title>
                    </mu-list-item>
                    <mu-divider></mu-divider>
                    <mu-list-item button  @click="a_index(['howModal','toggle',true])">
                        <mu-list-item-title>
                            <md-icon>info</md-icon>&nbsp;使い方</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="a_mapstore(['set','mode','wide_map']);">
                <md-icon>flight_takeoff</md-icon>
            </mu-button>

            <mu-button flat slot="right" :color="mapstore.geocoding.on ? 'green' : 'grey500'" @click="emoryMyPosition">
                <span v-if="mapstore.geocoding.on">トラック中</span>
                <md-icon>directions_walk</md-icon>
            </mu-button>

            <mu-button flat slot="right" @click="a_index(['howModal','toggle',true])">
                <md-icon>info</md-icon>
            </mu-button>
        </mu-appbar>

        <!-- AppBar News -->
        <mu-appbar class="appbar-subscribe mu-appbar-header" color="purple900" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="menu.news">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/subscribe/logos/white.png" style="width:110px; height:auto;"></mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('news')">

                    <mu-list-item button to="/">
                        <mu-list-item-title>
                            <md-icon>home</md-icon>&nbsp;トップ</mu-list-item-title>
                    </mu-list-item>

                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="side.news.left.open = true">
                <md-icon>spellcheck</md-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <md-icon>border_bottom</md-icon>
            </mu-button>
            <mu-button flat slot="right" @click="side.news.right.open=true">
                <md-icon>dashboard</md-icon>
            </mu-button>
        </mu-appbar>

        <!-- Spotify Drawers -->
        <mu-drawer :open.sync="side.spotify.left.open" :docked="side.spotify.left.docked" :width="300" @change="()=> a_index(['side','left',{key:'spotify',val:'toggle'}])">
            <mu-list style="width:inherit;">
                <aside-view @rightopen="a_index(['side','right',{key:'spotify',val:true}])"></aside-view>
            </mu-list>
        </mu-drawer>

        <mu-drawer :open.sync="side.spotify.right.open" :docked="side.spotify.right.docked" :right="true" :width="300" @change="()=> a_index(['side','right',{key:'spotify',val:'toggle'}])">
            <mu-list>
                <playlist-view
                        @leftopen="a_index(['side','left',{key:'spotify',val:true}])"
                        @close="a_index(['side','right',{key:'spotify',val:false}])"
                        @open="a_index(['side','right',{key:'spotify',val:true}])"/>
            </mu-list>
        </mu-drawer>
        <!--/Spotify Drawers -->

        <!-- Emory Drawers -->
        <mu-drawer :open.sync="side.emory.left.open" :docked="side.emory.left.docked" :width="300" style="background-color:#0d7970;" @change="()=> a_index(['side','left',{key:'emory',val:'toggle'}])">
            <mu-list style="width:inherit;">
                <emory-left-view
                        @close="a_index(['side','left',{key:'emory',val:false}])"></emory-left-view>
            </mu-list>
        </mu-drawer>
        <!--/Emory Drawers -->

        <!-- News Drawers -->
        <mu-drawer :open.sync="side.news.left.open" :docked="side.news.left.docked" :width="350" style="background-color:#4f23be;" @change="()=> a_index(['side','left',{key:'news',val:'toggle'}])">
            <mu-list style="width:inherit;">
                <subscribe-left-view></subscribe-left-view>
            </mu-list>
        </mu-drawer>

        <mu-drawer :open.sync="side.news.right.open" :docked="side.news.right.docked" :right="true" :width="300" @change="()=> a_index(['side','right',{key:'news',val:'toggle'}])">
            <mu-list style="width:inherit;padding:0;">
                <subscribe-right-view
                        @close="a_index(['side','right',{key:'news',val:false}])"
                        @open="a_index(['side','right',{key:'news',val:true}])"/>
            </mu-list>
        </mu-drawer>
        <!--/News Drawers -->

    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex';

    // LEFT
    import AsideView from './AsideView';
    import EmoryLeftView from './EmoryLeftView';
    import SubscribeLeftView from './SubscribeLeftView';

    // RIGHT
    import PlaylistView from './PlaylistView';
    import SubscribeRightView from './SubscribeRightView';

    export default {
        name: 'myheader',
        components:{
            AsideView,
            EmoryLeftView,
            PlaylistView,
            SubscribeLeftView,
            SubscribeRightView
        },
        data:function(){
            return{
                menu: {
                    normal: false,
                    map: false,
                    news: false
                }
            }
        },
        computed:mapGetters([
            'bottom',
            'rootAction',
            'header',
            'side',
            'mapstore'
        ]),

        methods:{
            ...mapActions(['a_index','a_mapstore']),

            toggleMenu(type){
                this.menu[type] = !this.menu[type];
            },

            emoryMyPosition(){
                this.a_mapstore(['set','tracking','toggle']);
                this.a_mapstore(['emory', 'alpha', {key: 'slider', val: 'toggle'}]);
                setTimeout(()=> this.a_mapstore(['emory','alpha',{key:'slider',val:false}]), 4000);
            }
        },

        watch:{
            'rootAction':{
                handler(newAction){
                    if(newAction.type==='leftopen') this.a_index(['side','left',{key:'spotify',val:true}]);
                },deep:true
            }
        }
    }
</script>
<style lang="scss">
    .mu-appbar-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 1000;
        overflow: hidden;
    }

    header.mu-appbar{
        transition: 1s;
        -webkit-transition: 1s;

        &.appbar-normal{
            transform: translateY(0px);
            &.Map, &.Emory, &.Subscribe, &.MapAdmin{
                transform: translateY(-68px);
            }
        }

        &.appbar-emory{
            transform: translateY(-68px);
            &.Map, &.Emory, &.MapAdmin{
                transform: translateY(0px);
            }
        }

        &.appbar-subscribe{
            transform: translateY(-68px);
            &.Subscribe{
                transform: translateY(0px);
            }
        }
    }

</style>
