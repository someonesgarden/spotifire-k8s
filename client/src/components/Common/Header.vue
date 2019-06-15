<template>
    <div id="HeaderTop" class="nav-header">
        <mu-appbar class="mu-appbar-header">
            <mu-button slot="left" @click="side.left.open = true" class="top-icon">
                <mu-icon value="border_left"></mu-icon>
            </mu-button>

            <mu-menu  open-on-hover cover placement="left-start" :open.sync="open">
                <mu-button flat>
                    <img class="menu-icon" src="/static/img/spotifire_logo.png" style="width:110px; height:auto;"></mu-button>
                <mu-list slot="content" @mouseup="toggleMenu">

<!--                    <mu-list-item button  @click="a_index(['storyModal','set',true])">-->
<!--                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;ストーリー</mu-list-item-title>-->
<!--                    </mu-list-item>-->

                    <mu-list-item button to="/">
                        <mu-list-item-title><mu-icon value="home" :size="15"></mu-icon>&nbsp;トップ</mu-list-item-title>
                    </mu-list-item>

<!--                    <mu-list-item button to="/map">-->
<!--                        <mu-list-item-title><mu-icon value="location_on" :size="15"></mu-icon>&nbsp;MAP</mu-list-item-title>-->
<!--                    </mu-list-item>-->

<!--                    <mu-list-item button to="/news">-->
<!--                        <mu-list-item-title><mu-icon value="filter_list" :size="12"></mu-icon>&nbsp;news</mu-list-item-title>-->
<!--                    </mu-list-item>-->

                    <mu-divider></mu-divider>
                    <mu-list-item button  @click="a_index(['howModal','set',true])">
                        <mu-list-item-title><mu-icon value="info" :size="15"></mu-icon>&nbsp;使い方</mu-list-item-title>
                    </mu-list-item>

                </mu-list>
            </mu-menu>

            <mu-button flat slot="right" color="grey500" @click="a_index(['bottom','open'])">
                <mu-icon value="border_bottom"></mu-icon>
            </mu-button>

            <mu-button flat slot="right" @click="side.right.open=true">
                <mu-icon value="border_right"></mu-icon>
            </mu-button>

        </mu-appbar>

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
                open:false,
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
        computed:mapGetters(['bottom','rootAction']),
        methods:{
            ...mapActions(['a_index']),

            toggleMenu(){
                console.log("toggleMenu!");
                this.open = !this.open;
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
<style>
    .mu-appbar-header {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        z-index: 101;
        overflow: hidden;
    }

    button.top-icon{
        -webkit-box-shadow:inherit;
        box-shadow:inherit;
        background-color:inherit;
    }

</style>
