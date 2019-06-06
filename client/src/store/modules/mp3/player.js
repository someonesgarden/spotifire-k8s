const state =
    {
        pods: [
            {
                file: 'https://p.scdn.co/mp3-preview/c0ceabc60f2f2393098959d53aa8bdd249d3819e',
                volume: 30,
                loop: false,
                update: new Date()
            },
            {
                file: 'https://p.scdn.co/mp3-preview/c0ceabc60f2f2393098959d53aa8bdd249d3819e',
                volume: 50,
                loop: true,
                udpate: new Date()
            },
            {
                file: 'https://p.scdn.co/mp3-preview/c0ceabc60f2f2393098959d53aa8bdd249d3819e',
                volume: 100,
                loo: false,
                update: new Date()
            }
        ]
    }

const mutations = {
    setPodParam(state, data) {
        state.pods[data.num][data.key] = data.val;
    }
}

export default {
    state,
    mutations
}
