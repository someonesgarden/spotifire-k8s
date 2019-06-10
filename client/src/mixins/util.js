export default {
    methods: {
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
            navigator.permissions.query({name: type})
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
                console.log("type:" + type);
                console.log(er)
            });
        },

        checkPWAExist(type) {
            if (type in navigator) {
                console.log(type + 'は利用可能です。');
                this.a_index(['pwa','set',{key:type,val:'granted'}]);
            }
        },

        checkPWAInWindow(type) {
            if (type in window) {
                this.a_index(['pwa','set',{key:type,val:'granted'}]);
            }
        }




    }
}
