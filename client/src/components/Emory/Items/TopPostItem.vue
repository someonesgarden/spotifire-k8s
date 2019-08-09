<template>
    <blog-card :shadow-normal="false" :no-colored-shadow="false" :card-image="post.thumb" @click="callTripAction">
        <template slot="cardContent">
            <h6 class="card-category text-warning">{{post.categories.join(' / ')}}</h6>
            <h4 class="card-title">
                <a @click="callTripAction" v-html="post.title"></a>
            </h4>
            <p class="card-description" v-html="post.excerpt"></p>
        </template>
    </blog-card>
</template>

<script>

    import mapMixin from '../../../mixins/map';

    import {BlogCard}  from "../../MD";
    export default {
        name: "TopPostItem",
        props:['post'],
        mixins:[mapMixin],
        components:{
            BlogCard
        },
        methods:{
            callTripAction(){
                console.log("callTrip no",this.post.trip);
                this.m_setIdAndMoveCenter(this.post.trip);
            }
        }
    }
</script>
