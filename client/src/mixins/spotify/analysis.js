import axios from 'axios';

import {mapActions} from 'vuex';

export default {

    methods: {
        ...mapActions(['a_index','a_spotify']),

        c_audioAnalyse(trackid){
            this.c_getAudioAnalysis(trackid,(res)=>{
                this.a_spotify(['set','analysis',res.data]);
                this.a_index(['root','action','analysis']);
                this.$router.push('/analysis');
            })
        }

    }
}
