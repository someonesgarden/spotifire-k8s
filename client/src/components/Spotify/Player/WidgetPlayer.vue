<template>
    <mu-paper  class="widget_player" v-if="$route.name ==='Map' || $route.name ==='MapAdmin'" :z-depth="5">
        <iframe :src="url" :width="width" :height="height" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    </mu-paper>
</template>

<script>
    export default {
        name: "WidgetPlayer",
        props:['w','h','u'],
        data(){
          return{
              url:"https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
              width:"100%",
              height:"80"
            }
        },
        mounted(){
            if(this.u) this.url = this.u;
            if(this.w) this.width = this.w;
            if(this.h) this.height = this.h;
        }
    }
</script>

<style scoped>

</style>
