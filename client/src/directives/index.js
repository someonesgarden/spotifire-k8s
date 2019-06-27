import Vue from 'vue'

Vue.directive('spotifycode', {

    bind(el, binding) {
        let val     = binding.value;
        let pid     = val.pid;
        let ptype   = val.ptype;

        el.classList.add('spotify_code_top');

        //console.log(`url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${ptype}:${pid}')`);

        if(!!pid) el.style.backgroundImage = `url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${ptype}:${pid}')`;
    },

    update: function(el, binding, vnode, oldVnode) {

        let val     = binding.value;
        let pid     = val.pid;
        let ptype   = val.ptype;

        el.classList.add('spotify_code_top');

        if(!!pid) el.style.backgroundImage = `url('https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:${ptype}:${pid}')`;
    }
})
