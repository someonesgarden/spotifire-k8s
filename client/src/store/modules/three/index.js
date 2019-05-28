import camera from './camera';
import models from './models';

let state = {
    ...camera.state,
    ...models.state
};

let mutations = {

    ...camera.mutations,
    ...models.mutations,

    setParam(state,data){
        state[data.obj][data.type][data.key].val = parseFloat(data.val);
    }
};

export default {
    namespaced: true,
    state,
    mutations
}
