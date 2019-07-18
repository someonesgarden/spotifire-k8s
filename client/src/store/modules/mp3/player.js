const state =
    {
        pods: [
            {
                file: '',
                volume: 0,
                loop: false,
                innerLoop:false,
                playing:false,
                autoPlay:false,
                update: new Date()
            },
            {
                file: '',
                volume: 0,
                loop: false,
                innerLoop:false,
                playing:false,
                autoPlay:false,
                udpate: new Date()
            },
            {
                file: '',
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
        console.log("setPodParam",data);
        state.pods[data.num][data.key] = data.val;
        state.pods[data.num].update = new Date();
    }
}

export default {
    state,
    mutations
}
