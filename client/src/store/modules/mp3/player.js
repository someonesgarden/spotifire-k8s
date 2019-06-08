const state =
    {
        pods: [
            {
                file: 'https://p.scdn.co/mp3-preview/c0ceabc60f2f2393098959d53aa8bdd249d3819e',
                volume: 0,
                loop: false,
                innerLoop:false,
                playing:false,
                autoPlay:false,
                update: new Date()
            },
            {
                file: 'https://p.scdn.co/mp3-preview/48c133b9714c17b8949767a3bae578c30503c103',
                volume: 0,
                loop: false,
                innerLoop:false,
                playing:false,
                autoPlay:false,
                udpate: new Date()
            },
            {
                file: 'https://p.scdn.co/mp3-preview/cbfbd116e340d2d5df8caf90ba38c15b744390f5',
                volume: 0,
                loop: false,
                innerLoop:false,
                playing:false,
                autoPlay:false,
                update: new Date()
            }
        ]
    }

const mutations = {
    setPodParam(state, data) {
        state.pods[data.num][data.key] = data.val;
        state.pods[data.num].update = new Date();
    }
}

export default {
    state,
    mutations
}
