import axios from 'axios';
import {mapActions} from 'vuex';


export default{

    methods: {
        c_set2LS(flag,data){
            let time    = new Date();
            let payload = {timestamp:time.getTime(), data:data};
            localStorage.setItem(flag, JSON.stringify(payload));
        },

        c_getCredential: function (mode='nopop') {

            //コールバック後に戻れるように
            this.c_set2LS('callpoint',this.$route.path);


            let isvalid = false;
            if(!!this.spotify.credential.expire_date){
                let now = new Date();
                if(this.spotify.credential.expire_date > now.getTime()) isvalid = true;
            }
            if(!isvalid){
                axios.post('/api/spotify/auth/get_credential', {})
                    .then(res => {

                        if(mode==='popup'){
                            window.open(res.data, null, 'width=350,height=580,toolbar=no,menubar=no,scrollbars=no');
                        }else{
                            window.location = res.data;
                        }


                    }).catch(error => {
                        console.log(error);
                        alert("エラーが発生しました");
                    });
            }
        },

        c_refreshCredential: function () {
            if(!!this.spotify.credential.expire_date){
                let now = new Date();
                if(this.spotify.credential.expire_date < now.getTime()){
                    console.log("NEED TO REFRESH CREDENTIAL");

                    axios.post('/api/spotify/auth/refresh_credential',this.spotify.credential)
                        .then(res => {
                            console.log("REFRESH DONE!");
                            if(!!res.data) this.a_spotify(['credential','set',res.data]);
                        }).catch(error => {
                        console.log(error);
                    });
                }else{
                    console.log("CREDENTIAL IS VALID");
                }
            }
        }
    }
}
