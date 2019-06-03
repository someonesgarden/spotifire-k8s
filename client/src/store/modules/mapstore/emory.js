const state = {
    emory: {
        projects: {
            all: {
                title: 'すべて（全マーカー表示）',
                center: {lat:35.67104,lng:139.734547},
                zoom:19
            }
            ,
            proj1: {
                title: '箱根「伝説のドラゴン編」',
                center: {lat:35.190825,lng:139.02609},
                zoom:20
            },
            proj2: {
                title: '仙台「食べ歩き恋物語]',
                center: {lat:38.268195,lng:140.869418},
                zoom:25
            }
        },
        all:'-LgQfo9-XfQHou8ixUre',
        project: '-LgQfo9-XfQHou8ixUre'
    }

}

const mutations = {
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
