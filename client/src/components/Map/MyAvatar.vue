<template>
    <mu-avatar slot="avatar">
        <img :src="iconImg.url" :alt="m.title" :style="{width:'auto',height:iconImg.h+'px'}" v-if="m"/>
    </mu-avatar>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "MyAvatar",
        props:['marker','id'],
        data(){
            return{
                m:null
            }
        },
        mounted(){
          if(!this.marker){
              this.m = this.mapstore.markers[this.id];
          }else{
              this.m = this.marker;
          }
        },
        computed:{
            ...mapGetters(['mapstore']),
            iconImg(){
                let icontype = (this.m.id === this.mapstore.mainuser.id) ? 'you' : this.m.type;
                let icon  = this.mapstore.icons[icontype][this.m.title.charCodeAt(0) % this.mapstore.icons[icontype].length];
                let w = 30;
                let h = 30;
                switch(icontype){
                    case 'you':
                        w = 50;
                        h = 50;
                        break;
                    case 'mainuser':
                    case 'user':
                        w = 42;
                        h = 42;
                        break;
                    case 'spot':
                        w = 34;
                        h = 34;
                        break;
                    case 'other':
                        w = 28;
                        h = 28;
                        break;
                }
                return {url:icon, w:w, h:h};
            }
        }
    }
</script>

<style scoped>

</style>
