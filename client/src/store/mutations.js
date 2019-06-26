import isMobile from 'ismobilejs'

const state = {

    header:{
        mode:"normal"
    },

    home:{
        verify:{
            news:false
        }
    },

    device:{
        platform: 'unknown',
        browser: 'unknown',
        userAgent: 'unknown'
    },
    loggedIn: false,
    bottom: {
        open: false
    },
    alert: {
        open: false,
        text: ""
    },
    rootAction:{
        type:'',
        date:new Date(),
    }
};

const  mutations = {

    setHomeVerify(state,data){
      state.home.verify[data.key] = data.val;
    },

    setHeaderMode(state,data){
      state.header.mode = data;
    },

    setPlatform(state) {
        console.log("setPlatform");
        let wakegi      = window.wakegi,
            Browser     = wakegi.Browser;
            state.device.browser   = 'unknown';

        if (isMobile.phone) {
            state.device.platform = 'SP';
        }
        else if (isMobile.tablet) {
            state.device.platform = 'TB';
        }
        else {
            state.device.platform = 'PC';
        }

        if (Browser.Chrome.is()) {
            state.device.browser = 'chrome'
        }
        else if (Browser.Safari.is()) {
            state.device.browser = 'safari'
        }
        else if (Browser.Firefox.is()) {
            state.device.browser = 'firefox';
        }
        else {
            state.device.browser = 'other';
        }

        let w = window.parent.screen.width;
        let h = window.parent.screen.height;

        if (state.device.platform === 'SP') {
            if (w < 370 && h < 650) {
                state.device.userAgent = 'oldiphone';
            } else if (w === 375 && h === 667) {
                state.device.userAgent = 'iphone678';
            } else if (w === 414 && h === 736) {
                state.device.userAgent = 'iphone678plus';
            } else if (w === 375 && h === 812) {
                state.device.userAgent = 'iphonex';
            } else {
                state.device.userAgent = 'higher';
            }
        } else {
            state.device.userAgent = 'widescreen';
        }

        console.log(this.device);
    },

    login(state, params) {
        let id = !!params.id ? params.id : '';
        let pass = !!params.pass ? params.pass : '';
        if(id === 'gameroom' && pass === 'tokyo') state.loggedIn = true
    },
    logout(state) { state.loggedIn = false },

    setBottomState(state,val){
        if(val==='toggle'){
            state.bottom.open = !state.bottom.open;
        }else{
            state.bottom.open = val;
        }
    },

    setAlertState(state,val){
       state.alert.open = val;
    },

    setAlertText(state,val){
      state.alert.text = val;
    },

    setAlertAction(state,val){
      state.alert.action = val;
    },

    setRootAction(state,val){
        state.rootAction.type = val;
        state.rootAction.date = new Date();
    }
}

export {
    state,
    mutations
}
