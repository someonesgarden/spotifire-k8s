import Vue  from 'vue';
import Vuex from 'vuex';
import * as getters from './getters'
import * as actions from './actions'
import { state, mutations } from './mutations';
import spotify from './modules/spotify/index';
import feed from './modules/feed/index';
import mapstore from './modules/mapstore/index';
import ws from './modules/ws/index';
import three from './modules/three/index';
import mp3 from './modules/mp3/index';
import genius from './modules/genius/index';
import modal from './modules/modal/index';
import side  from './modules/side/index';
import pwa from './modules/pwa/index';
import svg from './modules/svg/index';
import subscribe from './modules/subscribe/index';

Vue.use(Vuex);

export default new Vuex.Store({
    actions,
    getters,
    state,
    mutations,
    modules:{
        spotify,
        feed,
        mapstore,
        ws,
        three,
        mp3,
        genius,
        modal,
        side,
        pwa,
        svg,
        subscribe
    }
});

