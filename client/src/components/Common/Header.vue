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
                        <mu-list-item-title><mu-icon value="extension" :size="15"></mu-icon>&nbsp;Emory</mu-list-item-title>
                    </mu-list-item>
                    <mu-divider></mu-divider>
                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="side.spotify.left.open = true">
                <mu-icon value="border_left"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <mu-icon value="border_bottom"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" @click="side.spotify.right.open=true">
                <mu-icon value="border_right"></mu-icon>
            </mu-button>
        </mu-appbar>

        <!-- AppBar Emory -->
        <mu-appbar class="appbar-emory mu-appbar-header" color="blueGrey900" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="menu.map">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/emory/logos/horizontal_w.png" style="width:110px; height:auto;"></mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('map')">
                    <mu-list-item button to="/">
                        <mu-list-item-title><mu-icon value="home" :size="15"></mu-icon>&nbsp;トップ</mu-list-item-title>
                    </mu-list-item>
                    <mu-divider></mu-divider>
                    <mu-list-item button  @click="a_index(['howModal','toggle',true])">
                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;使い方</mu-list-item-title>
                    </mu-list-item>
                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="side.emory.left.open = true">
                <mu-icon value="train"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <mu-icon value="border_bottom"></mu-icon>
            </mu-button>
            <mu-button flat slot="right">
                <mu-icon value="dashboard"></mu-icon>
            </mu-button>
        </mu-appbar>

        <!-- AppBar News -->
        <mu-appbar class="appbar-subscribe mu-appbar-header" color="purple900" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="menu.news">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/subscribe/logos/white.png" style="width:110px; height:auto;"></mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('news')">

                    <mu-list-item button to="/">
                        <mu-list-item-title><mu-icon value="home" :size="15"></mu-icon>&nbsp;トップ</mu-list-item-title>
                    </mu-list-item>

                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="side.news.left.open = true">
                <mu-icon value="spellcheck"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <mu-icon value="border_bottom"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" @click="side.news.right.open=true">
                <mu-icon value="dashboard"></mu-icon>
            </mu-button>
        </mu-appbar>

        <!-- Spotify Drawers -->
        <mu-drawer :open.sync="side.spotify.left.open" :docked="side.spotify.left.docked" :width="300">
            <mu-list style="width:inherit;">
                <aside-view @rightopen="side.spotify.right.open=true"></aside-view>
            </mu-list>
        </mu-drawer>

        <mu-drawer :open.sync="side.spotify.right.open" :docked="side.spotify.right.docked" :right="true" :width="300">
            <mu-list>
                <playlist-view @leftopen="side.spotify.left.open=true" @close="side.spotify.right.open=false" @open="side.spotify.right.open=true"/>
            </mu-list>
        </mu-drawer>
        <!--/Spotify Drawers -->

        <!-- Emory Drawers -->
        <mu-drawer :open.sync="side.emory.left.open" :docked="side.emory.left.docked" :width="350" style="background-color:#0d7970;">
            <mu-list style="width:inherit;">
                <emory-left-view @close="side.emory.left.open=false"></emory-left-view>
            </mu-list>
        </mu-drawer>
        <!--/Emory Drawers -->

        <!-- News Drawers -->
        <mu-drawer :open.sync="side.news.left.open" :docked="side.news.left.docked" :width="350" style="background-color:#4f23be;">
            <mu-list style="width:inherit;">
                <subscribe-left-view></subscribe-left-view>
            </mu-list>
        </mu-drawer>

        <mu-drawer :open.sync="side.news.right.open" :docked="side.news.right.docked" :right="true" :width="300">
            <mu-list style="width:inherit;padding:0;">
                <subscribe-right-view  @close="side.news.right.open=false" @open="side.news.right.open=true"/>
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
                },
                side:{
                    spotify:{
                        left:{
                            open:false,
                            docked:false
                        },
                        right:{
                            open:false,
                            docked:false
                        }
                    },

                    news: {
                        left: {
                            open: false,
                            docked: false
                        },
                        right: {
                            open: false,
                            docked: false
                        }
                    },

                    emory:{
                        left:{
                            open:false,
                            docked:false
                        }
                    },
                    left:{
                        open:false,
                        docked:false
                    },
                    right:{
                        open:false,
                        docked:false
                    }
                }
            }
        },
        computed:mapGetters(['bottom','rootAction','header']),
        methods:{
            ...mapActions(['a_index']),

            toggleMenu(type){
                this.menu[type] = !this.menu[type];
            }
        },

        watch:{
            'rootAction':{
                handler(newAction){
                    if(newAction.type==='leftopen') this.side.spotify.left.open = true;
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
        z-index: 101;
        overflow: hidden;
    }

    header.mu-appbar{
        transition: 1s;
        -webkit-transition: 1s;

        &.appbar-normal{
            transform: translateY(0px);
            &.Map, &.Emory, &.Subscribe{
                transform: translateY(-68px);
            }
        }

        &.appbar-emory{
            transform: translateY(-68px);
            &.Map, &.Emory{
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
