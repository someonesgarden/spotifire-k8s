import Vue from 'vue'

// <div v-spotifycode="{id:feature.spotify.id,type:feature.spotify.type}"></div>
Vue.directive('spotifycode', {
    bind(el, binding) {
        let id     = binding.value.id;
        let type   = binding.value.type;

        if(!type){
            let ids = id.split('%2F');
            type = ids[0];

            id   = ids[1];
        }

        el.classList.add('spotify_code_top');
        if(!!id) el.style.backgroundImage = `url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${type}:${id}')`;
    },

    update: function(el, binding, vnode, oldVnode) {
        let id     = binding.value.id;
        let type   = binding.value.type;

        if(!type){
            let ids = id.split('%2F');
            type = ids[0];
            id   = ids[1];
        }

        el.classList.add('spotify_code_top');
        if(!!id) el.style.backgroundImage = `url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${type}:${id}')`;
    }
})

