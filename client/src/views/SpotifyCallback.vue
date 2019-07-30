<template>
    <div class="wrapper" style="background-color:#17ffdc;">
        <parallax class="section page-header header-filter" parallax-active="true">
            <div class="container">

                <div class="md-layout-item md-size-33 md-small-size-66 md-xsmall-size-100 md-medium-size-40 mx-auto text-center">
                    <h2>welcome back.</h2>
                </div>
            </div>
        </parallax>
    </div>
</template>

<script>
    import axios from 'axios';
    import {mapActions,mapGetters} from 'vuex';
    export default {
        name: "SpotifyCallback",
        mounted(){
            let code = this.$route.query.code;

            let callpoint = localStorage.getItem('callpoint') || null;
            if(callpoint){
                callpoint = JSON.parse(callpoint);
                callpoint = callpoint.data;
            }

            axios.get('/api/spotify/auth/get_auth_from_code',{params:{'code':code}})
                .then(res => {
                    //Authを取得できたら、
                    //とりあえずサイトのログインは終わったことにする（今だけ！）
                    this.a_login({id:'gameroom',pass:'tokyo'});

                    let credentials = {
                        expires_in: res.data.body['expires_in'],
                        access_token: res.data.body['access_token'],
                        refresh_token: res.data.body['refresh_token']
                    };

                    this.a_spotify(['set','credential',credentials]);
                    this.a_spotify(['set','me',res.data.me]);

                    //認証前のページへそのまま戻る.
                    if(callpoint){
                        this.$router.push(callpoint);
                    }else{
                        this.$router.push('/');
                    }

                })
                .catch(error => {
                console.log(error);
                this.$router.push('/');
            });
        },

        methods:mapActions(['a_login','a_spotify'])
    }
</script>
