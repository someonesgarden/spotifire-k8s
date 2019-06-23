<template>
    <div class="slide_inner">

        <h1>{{slide.title}}</h1>
        <img :src="slide.thumb" class="circle">
        <p v-html="slide.content"></p>
        <widget-player></widget-player>
        <mu-button full-width color="black" @click="a_index(['storyModal','set',false])">
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
