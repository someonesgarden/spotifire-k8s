const state = {
    emory: {
        alpha:  {slider:false},
        slider: {no:0},
        mode:   'info',
        loader: false,
        editing: {
            status: false,
            type:   'marker'
        },
        play:{
            init:    false
        },
        projects: {
            all: {
                title:  '読み込み中です...',
                center: {lat:35.67104,lng:139.734547},
                zoom:   19
            }
        },
        triggerDist:20,
        searchDist: 100,

        all:'all',
        selectedPoint:{
          top:-300,
          left:-300
        },

        marker: {
            id:null,
            markertype: 'mp3',
            isEpisode:  false,
            center:     null,
            title:      "",
            desc:       "",
            type:       'other',
            spotifyid:  "",
            public:     'open',
            thumb:      null,
            project:    null,
            w:          35,
            h:          35,
            loop:       false
        },

        project:{
            id:         null,
            center:     null,
            zoom:       22,
            desc:       "",
            title:      "",
            spotifyid:  ""
        }
    }

}

const mutations = {

    setLoader(state,data){
        if(data==='toggle'){
            state.emory.loader = !state.emory.loader;
            return;
        }
        state.emory.loader = data;
    },

    setSliderNo(state,data){
        state.emory.slider.no = data;
    },

    setAlpha(state,data){
        if(data.val==='toggle'){
            state.emory.alpha[data.key] = !state.emory.alpha[data.key];
            return;
        }

      state.emory.alpha[data.key] = data.val;
    },

    setSelectedPoint(state,data){
      state.emory.selectedPoint.left = data[0];
      state.emory.selectedPoint.top = data[1];
    },

    setMode(state,data){
      state.emory.mode = data;
    },

    setEditing(state,data){
      state.emory.editing[data.key] = data.val;
    },

    setEmoryPlay(state,dat){
      state.emory.play[dat.key] = dat.val;
    },

    setTriggerDist(state,val){
        state.emory.triggerDist = val;
    },

    setSearchDist(state,val){
        state.emory.searchDist = val;
    },

    setEmoryProjects(state,val){
        state.emory.projects = val;
    },

    setEmoryProject(state,val){
        state.emory.project = val;
    },

    setEmoryProjectID(state,val){
        state.emory.project.id = val;
        state.emory.marker.project = val;
    },

    // MARKERS
    setEmoryMarker(state,data){
        state.emory.marker = data;
    },
    setMarkerParam(state,data){
        state.emory.marker[data.key] = data.val;
    },
    setProjectParam(state,data){
        state.emory.project[data.key] = data.val;
    }

}

export default {
    state,
    mutations
}
