import {mapGetters,mapActions} from 'vuex';

import base from './base';
import tracking from './tracking';

export default{
    mixins:[
        base,
        tracking
    ],

    computed: mapGetters(['mapstore']),
    methods: mapActions(['a_mapstore'])
}
