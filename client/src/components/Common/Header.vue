<template>
    <div id="HeaderTop" class="nav-header">

        <!-- AppBar Normal -->
        <mu-appbar class="appbar-normal mu-appbar-header" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="open.normal">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/spotifire_logo.png" style="width:110px; height:auto;"></mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('normal')">

<!--                    <mu-list-item button  @click="a_index(['storyModal','set',true])">-->
<!--                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;ストーリー</mu-list-item-title>-->
<!--                    </mu-list-item>-->

                    <mu-list-item button to="/emory">
                        <mu-list-item-title><mu-icon value="extension" :size="15"></mu-icon>&nbsp;Emory</mu-list-item-title>
                    </mu-list-item>

<!--                    <mu-list-item button to="/animesvg">-->
<!--                        <mu-list-item-title><mu-icon value="location_on" :size="15"></mu-icon>&nbsp;SVG</mu-list-item-title>-->
<!--                    </mu-list-item>-->

<!--                    <mu-list-item button to="/news">-->
<!--                        <mu-list-item-title><mu-icon value="filter_list" :size="12"></mu-icon>&nbsp;news</mu-list-item-title>-->
<!--                    </mu-list-item>-->

                    <mu-divider></mu-divider>
<!--                    <mu-list-item button  @click="a_index(['howModal','toggle',true])">-->
<!--                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;使い方</mu-list-item-title>-->
<!--                    </mu-list-item>-->

                </mu-list>
            </mu-menu>

            <mu-button flat slot="left" @click="side.left.open = true">
                <mu-icon value="border_left"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <mu-icon value="border_bottom"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" @click="side.right.open=true">
                <mu-icon value="border_right"></mu-icon>
            </mu-button>

        </mu-appbar>

        <!-- AppBar Emory -->
        <mu-appbar color="blueGrey900" class="appbar-emory mu-appbar-header" :class="[$route.name]">

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="open.map">

                <mu-button flat>
                    <img class="menu-icon" src="/static/img/emory_logo_h_w.png" style="width:110px; height:auto;"></mu-button>
                <mu-list slot="content" @mouseup="toggleMenu('map')">

                    <!--                    <mu-list-item button  @click="a_index(['storyModal','set',true])">-->
                    <!--                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;ストーリー</mu-list-item-title>-->
                    <!--                    </mu-list-item>-->

                    <mu-list-item button to="/">
                        <mu-list-item-title><mu-icon value="home" :size="15"></mu-icon>&nbsp;トップ</mu-list-item-title>
                    </mu-list-item>

<!--                    <mu-list-item button to="/animesvg">-->
<!--                        <mu-list-item-title><mu-icon value="location_on" :size="15"></mu-icon>&nbsp;SVG</mu-list-item-title>-->
<!--                    </mu-list-item>-->

                    <!--                    <mu-list-item button to="/news">-->
                    <!--                        <mu-list-item-title><mu-icon value="filter_list" :size="12"></mu-icon>&nbsp;news</mu-list-item-title>-->
                    <!--                    </mu-list-item>-->

                    <mu-divider></mu-divider>
                    <mu-list-item button  @click="a_index(['howModal','toggle',true])">
                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;使い方</mu-list-item-title>
                    </mu-list-item>

                </mu-list>
            </mu-menu>

            <mu-button flat slot="left">
                <mu-icon value="train"></mu-icon>
            </mu-button>
            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <mu-icon value="border_bottom"></mu-icon>
            </mu-button>
            <mu-button flat slot="right">
                <mu-icon value="dashboard"></mu-icon>
            </mu-button>

        </mu-appbar>



        <!-- Drawers -->
        <mu-drawer :open.sync="side.left.open" :docked="side.left.docked" :width="300">
            <mu-list style="width:inherit;">
                <aside-view @rightopen="side.right.open=true"></aside-view>
            </mu-list>
        </mu-drawer>

        <mu-drawer :open.sync="side.right.open" :docked="side.right.docked" :right="true" :width="300">
            <mu-list>
                <playlist-view @leftopen="side.left.open=true" @close="side.right.open=false" @open="side.right.open=true"/>
            </mu-list>
        </mu-drawer>

    </div>
</template>

<script>
    import {mapGetters,mapActions} from 'vuex';

    import AsideView from './AsideView';
    import PlaylistView from './PlaylistView';

    export default {
        name: 'myheader',
        components:{
            AsideView,
            PlaylistView
        },
        data:function(){
            return{
                open:{
                  normal:false,
                  map:false
                },
                side:{
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
                this.open[type] = !this.open[type];
            }
        },

        watch:{
            'rootAction':{
                handler(newAction){
                    if(newAction.type==='leftopen') this.side.left.open = true;
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
            &.Home, &.Login{
                transform: translateY(0px);
            }
            &.Map, &.Emory{
                transform: translateY(-68px);
            }
        }

        &.appbar-emory{
            &.Home, &.Login{
                transform: translateY(-68px);
            }
            &.Map, &.Emory{
                transform: translateY(0px);
            }
        }
    }

</style>
