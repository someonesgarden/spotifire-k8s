const state = {
    emory: {
        projects: {
            all: {
                title: '赤坂見附',
                center: {lat:35.67104,lng:139.734547},
                zoom:19
            }
        },
        triggerDist:30,
        all:'-LgQfo9-XfQHou8ixUre',
        project: "プロジェクトを選択してください"
    }

}

const mutations = {
    setTriggerDist(state,val){
        state.emory.triggerDist = val;
    },

    setEmoryProjects(state,val){
        state.emory.projects = val;
    },

    setEmoryProject(state,val){
        state.emory.project = val;
    },

}

export default {
    state,
    mutations
}
