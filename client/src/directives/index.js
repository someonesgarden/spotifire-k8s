import Vue from 'vue'

Vue.directive('spotifycode', {

    bind(el, binding) {
        let val     = binding.value;
        let id     = val.id;
        let type   = val.type;

        el.classList.add('spotify_code_top');
        console.log(`url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${type}:${id}')`);
        if(!!id) el.style.backgroundImage = `url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${type}:${id}')`;
    },

    update: function(el, binding, vnode, oldVnode) {

        let val     = binding.value;
        let id     = val.id;
        let type   = val.type;

        el.classList.add('spotify_code_top');

        if(!!id) el.style.backgroundImage = `url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${type}:${id}')`;
    }
})
