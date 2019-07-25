<template>
    <div>
        <h3><strong>TESTs</strong></h3>
        <hr>

        <h3>#2 POSTS from mysql</h3>
        <div v-if="test2.items">
            <div v-for="(item,idx) in test2.items" :key="'item'+idx">
                <div v-if="item.thumbnail_url">
                    <img :src="item.thumbnail_url" />
                </div>

                <h3 v-html="decodeURIComponent(item.post_title)"></h3>
                <p v-html="decodeURIComponent(item.post_excerpt)"></p>
                <p v-html="decodeURIComponent(item.post_content)"></p>
                <p v-if="item.spotifyid">{{item.spotifyid}}</p>
            </div>
        </div>

    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import mysqlMixin from '../mixins/mysql/index';

    export default {
        name: "TestView",
        mixins:[mysqlMixin],

        data:()=>({
            test1:{
                items:null
            },
            test2:{
                items:null
            },
        }),

        mounted(){
            this.c_mysql_getall('initials',(res)=> this.test1.items = res.data);
            this.c_mysql_getall('posts',(res)=> this.test2.items = res.data);
        }
    }
</script>

<style scoped>

</style>
