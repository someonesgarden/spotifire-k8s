import {mapGetters,mapActions} from 'vuex';
import baseMix from './base';
import lyricsMix from './lyrics';
import initialsMix from './initials';

export default{
    mixins: [
        baseMix,
        lyricsMix,
        initialsMix
    ],
    computed: mapGetters(['spotify']),
    methods: mapActions(['a_spotify'])
}
