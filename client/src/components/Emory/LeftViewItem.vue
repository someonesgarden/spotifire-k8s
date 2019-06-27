<template>
    <mu-card class="leftviewitem">

<!--        <mu-card-header :title="feature.category" :sub-title="feature.distance" :class="[feature.type]">-->
<!--            <mu-avatar slot="avatar">-->
<!--                <img :src="feature.icon">-->
<!--            </mu-avatar>-->
<!--        </mu-card-header>-->

        <mu-card-media :title="feature.title" :sub-title="feature.subtitle">
            <img :src="feature.thumb">
        </mu-card-media>
        <div v-if="feature.spotify" ref="spotifycode" v-spotifycode="{id:feature.spotify.id,type:feature.spotify.type}"></div>
        <mu-card-text>
           {{feature.desc}}
        </mu-card-text>
       <left-view-timeline :steps="feature.steps"></left-view-timeline>
    </mu-card>
</template>

<script>
    import LeftViewTimeline from './LeftViewTimeline';
    export default {
        name: "LeftViewItem",
        components:{
            LeftViewTimeline
        },
        props:['feature']
    }
</script>

<style scoped lang="scss">

</style>
