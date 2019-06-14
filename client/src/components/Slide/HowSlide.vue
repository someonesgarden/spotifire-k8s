<template>
    <div>
        <img :src="slide.thumb" class="circle">
        <h1><dot-loader class="spinner"></dot-loader>{{slide.title}}</h1>
        <p v-html="slide.content"></p>
        <mu-button color="blueGrey900" full-width @click="$emit('moveTo')" v-if="!end">次へ</mu-button>
    </div>

</template>

<script>
    import DotLoader from 'vue-spinner/src/DotLoader.vue';

    export default {
        name: "HowSlide",
        props:['slide','end'],
        components:{
            DotLoader
        }
    }
</script>

<style scoped>

</style>
