import {mapGetters,mapActions} from 'vuex';
import browseMix from './browse';

export default{
    mixins:[
        browseMix,
    ],
    computed: mapGetters(['spotify']),
    methods: mapActions(['a_spotify'])
}
