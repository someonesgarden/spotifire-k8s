import {mapGetters,mapActions} from 'vuex';
import baseMix from './base';

export default{
    mixins:[
       baseMix,
    ],
    computed: mapGetters(['spotify']),
    methods: mapActions(['a_spotify'])
}
