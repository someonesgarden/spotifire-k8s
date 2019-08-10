import {mapGetters,mapActions} from 'vuex';

import base from './base';
import tracking from './tracking';
import mapbox from './mapbox';

export default{
    mixins:[
        base,
        tracking,
        mapbox
    ],

    computed: mapGetters(['mapstore']),
    methods: mapActions(['a_mapstore'])
}
