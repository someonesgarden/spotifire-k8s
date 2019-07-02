<template>
    <div class="snack_feature">
        <h3 v-html="lyric.lyrics"></h3>
        <mu-paper  class="widget_player" :z-depth="5">
            <iframe :src="trackurl" width="100%" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>
        </mu-paper>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    export default {
        name: "SnackInitial",
        props:['lyric'],
        data () {
            return {

                url:null,
            }
        },
        computed: {
            ...mapGetters(['spotify']),

            trackurl() {
                return "https://open.spotify.com/embed/track/" + this.lyric.spotifyid;
            }
        }
    }
</script>
