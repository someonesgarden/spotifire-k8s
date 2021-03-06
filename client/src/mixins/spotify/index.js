import {mapGetters,mapActions} from 'vuex';
import authMix from './auth';
import meMix from './me';
import browseMix from './browse';
import playlistMix from './playlist';
import trackMix from './track';
import artistMix from './artist';
import albumMix from './album';
import playerMix from './player';
import filterMix from './filter';
import analyseMix from './analysis';

export default{
    mixins:[
        authMix,
        meMix,
        browseMix,
        playlistMix,
        trackMix,
        artistMix,
        albumMix,
        playerMix,
        filterMix,
        analyseMix
    ],
    computed: mapGetters(['spotify']),
    methods: mapActions(['a_spotify'])
}
