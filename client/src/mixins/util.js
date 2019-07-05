export default {
    methods: {
        goMap(login,to='/map'){
            if(this.loggedIn){
                if(login && !this.spotify.credential.expires_in){
                    this.c_getCredential();
                }else{
                    this.a_spotify(['set','me',{id:'GUEST'}]);
                }
                this.$router.push(to);
            }
        },

        isNumber(val) {
            let pattern = /^[-]?([1-9]\d*|0)(\.\d+)?$/;
            return pattern.test(val);
        },

        isSpecialCharas(val) {
            let pattern = /([。.,?？*+=~^"#%&¥]+)/;
            return pattern.test(val);
        },

        isHiragana(val, num) {
            let pattern = /^[ぁ-んー　]*$/;
            return (pattern.test(val) && val.length < 3);
        },

        checkPWA(type) {
            let navigator_ = navigator ? navigator : (window.navigator ? window.navigator : null);
            if(navigator_){
                if(navigator_.permissions){
                    navigator_.permissions.query({name: type})
                        .then((result) => {
                            if (result.state === 'granted') {
                                console.log(type + 'は利用可能です。');
                            } else if (result.state === 'denied') {
                                console.log(type + 'は利用不可能です。');
                            } else if (result.state === 'prompt') {
                                console.log(type + 'の利用には許可が必要です。');
                            }
                            this.a_index(['pwa', 'set', {key: type, val: result.state}]);
                        }).catch(er => {
                        console.log(er);
                        this.checkPWAExist(type);
                    });
                }else{

                    if (type in navigator_) {
                        console.log(type + 'は利用可能です。');
                        this.a_index(['pwa','set',{key:type,val:'granted'}]);
                    }else{
                        this.checkPWAInWindow(type);
                    }
                }
            }
        },

        checkPWAExist(type) {
            if (type in navigator) {
                console.log(type + 'は利用可能です。');
                this.a_index(['pwa','set',{key:type,val:'granted'}]);
            }else{
                this.checkPWAInWindow(type);
            }
        },

        checkPWAInWindow(type) {
            if (Boolean(type in window)) {
                this.a_index(['pwa','set',{key:type,val:'granted'}]);
            }else{
                this.a_index(['pwa', 'set', {key: type, val: 'error'}]);
            }
        },

        checkPWAInFunction(type) {
            if (typeof type === "function") {
                this.a_index(['pwa','set',{key:type,val:'granted'}]);
            }else{
                this.a_index(['pwa', 'set', {key: type, val: 'error'}]);
            }
        },

        c_getRandomColor(letters) {
            let color = '#';
            for (let i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * letters.length)];
            }
            return color;
        },

        c_gradient_bg:function(base=255,offset=0) {
            let c1 = {
                r: Math.floor(Math.random()*base+offset),
                g: Math.floor(Math.random()*base+offset),
                b: Math.floor(Math.random()*base+offset)
            };
            let c2 = {
                r: Math.floor(Math.random()*base+offset),
                g: Math.floor(Math.random()*base+offset),
                b: Math.floor(Math.random()*base+offset)
            };
            c1.rgb = 'rgb('+c1.r+','+c1.g+','+c1.b+')';
            c2.rgb = 'rgb('+c2.r+','+c2.g+','+c2.b+')';
            return 'background: radial-gradient(at top left, '+c1.rgb+', '+c2.rgb+')';
        },

    }
}
