<template>
    <div class="slide_inner">

        <h1>{{slide.title}}</h1>
        <img :src="slide.thumb" class="circle">
        <p v-html="slide.content"></p>
        <mu-button full-width @click="a_index(['storyModal','set',false])">
            <mu-icon value="keyboard_arrow_down"></mu-icon>
        </mu-button>
    </div>

</template>

<script>
    import {mapActions} from 'vuex';
    export default {
        name: "StorySlide",
        props:['slide','end'],
        components:{
        },
        methods:mapActions(['a_index'])
    }
</script>

<style scoped lang="scss">



</style>
