<template>
    <div class="slide_inner">
        <div style="float:none;clear:both;width:100%;margin-bottom:10px;">
            <mu-flex justify-content="center" direction="row" align-items="center" style="width:100%;">
                <img :src="slide.thumb" class="circle"><h1>{{slide.title}}</h1>
            </mu-flex>

            <p v-html="slide.content"></p>
        </div>

        <widget-player :type="slide.spotifytype" :id="slide.spotifyid"></widget-player>
        <mu-button full-width color="greenA400" @click="a_index(['storyModal','set',false])">
            <mu-icon value="keyboard_arrow_down"></mu-icon>
        </mu-button>
    </div>

</template>

<script>
    import {mapActions} from 'vuex';
    import WidgetPlayer from '../Spotify/Player/WidgetPlayer';
    export default {
        name: "StorySlide",
        props:['slide','end'],
        components:{
            WidgetPlayer
        },
        methods:mapActions(['a_index'])
    }
</script>

<style scoped lang="scss">



</style>
