import {mapGetters,mapActions} from 'vuex';
import base from './base';
import lyrics from './lyrics';
import initials from './initials';

export default{
    mixins: [
        base,
        lyrics,
        initials
    ],
    computed: mapGetters(['spotify','subscribe']),
    methods: mapActions(['a_spotify','a_subscribe'])
}
