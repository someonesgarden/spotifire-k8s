<template>
    <div>
        <img :src="slide.thumb" class="circle">
        <h1><dot-loader class="spinner"></dot-loader>{{slide.title}}</h1>
        <p v-html="slide.content"></p>
        <mu-button color="blueGrey900" full-width @click="$emit('moveTo')" v-if="!end">次へ</mu-button>
        <mu-button color="teal600" full-width @click="a_index(['howModal','toggle',false])" v-else>戻る</mu-button>
    </div>

</template>

<script>
    import DotLoader from 'vue-spinner/src/DotLoader.vue';
    import {mapActions} from 'vuex';
    export default {
        name: "HowSlide",
        props:['slide','end'],
        components:{
            DotLoader
        },
        methods:mapActions(['a_index'])
    }
</script>

<style scoped>

</style>
