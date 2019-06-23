<template>
    <mu-paper  class="widget_player" v-if="$route.name ==='Map' || $route.name ==='MapAdmin'" :z-depth="5" :style="{height:height+'px'}">
        <iframe :src="url" :width="width" :height="height" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
    </mu-paper>
</template>

<script>
    export default {
        name: "WidgetPlayer",
        props:['w','h','type','id'],
        data(){
          return{
              url:"https://open.spotify.com/embed/album/1DFixLWuPkv3KT3TnV35m3",
              width:"100%",
              height:"80"
            }
        },
        mounted(){
            if(this.type && this.id) this.url = "https://open.spotify.com/embed/"+this.type+"/"+this.id;
            if(this.w) this.width = this.w;
            if(this.type==='episode'){
                this.height = 230;
            }else if(this.type==='track'){
                this.height = 80;
            }
        }
    }
</script>

<style scoped>

</style>
