<template>
    <div class="snack_feature">
        <h3 v-html="lyric.lyrics"></h3>
        <mu-paper :z-depth="5" style="background-color:black;">
            <iframe :src="trackurl" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </mu-paper>
    </div>
</template>

<script>
    export default {
        name: "SnackTrack",
        props:['lyric'],
        computed:{
            trackurl(){
                return "https://open.spotify.com/embed/track/"+this.lyric.spotifyid;
            }
        }
    }
</script>
