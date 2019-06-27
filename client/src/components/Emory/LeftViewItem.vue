<template>
    <mu-card class="leftviewitem">

<!--        <mu-card-header :title="features.category" :sub-title="features.distance" :class="[features.type]">-->
<!--            <mu-avatar slot="avatar">-->
<!--                <img :src="features.icon">-->
<!--            </mu-avatar>-->
<!--        </mu-card-header>-->

        <mu-card-media :title="features.title" :sub-title="features.subtitle">
            <img :src="features.thumb">
        </mu-card-media>
        <mu-card-text>
           {{features.desc}}
        </mu-card-text>
       <left-view-timeline :steps="features.steps"></left-view-timeline>
    </mu-card>
</template>

<script>
    import LeftViewTimeline from './LeftViewTimeline';
    export default {
        name: "LeftViewItem",
        components:{
            LeftViewTimeline
        },
        props:['features']
    }
</script>

<style scoped lang="scss">

</style>
