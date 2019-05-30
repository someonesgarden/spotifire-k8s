<template>
    <mu-container class="flex_v">
        <div id="analysis_area" class="base">
            <mu-paper :z-depth="1" class="analysis_metalist">
                <mu-list toggle-nested>
                    <mu-list-item button :ripple="false" nested :open="open === 'meta'" @toggle-nested="open = arguments[0] ? 'meta' : ''" v-if="analysis.meta">
                        <mu-list-item-action>
                            <mu-icon value="send"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>Meta</mu-list-item-title>
                        <mu-list-item-action>
                            <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item button :ripple="false" slot="nested" v-for="(val,key,index) in analysis.meta" :key="'meta'+key+index">
                            <mu-list-item-title>{{key}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{val}}</mu-list-item-sub-title>
                        </mu-list-item>
                    </mu-list-item>

                    <mu-list-item button :ripple="false" nested :open="open === 'track'" @toggle-nested="open = arguments[0] ? 'track' : ''" v-if="analysis.track">
                        <mu-list-item-action>
                            <mu-icon value="send"></mu-icon>
                        </mu-list-item-action>
                        <mu-list-item-title>Track</mu-list-item-title>

                        <mu-list-item-action>
                            <mu-icon class="toggle-icon" size="24" value="keyboard_arrow_down"></mu-icon>
                        </mu-list-item-action>

                        <mu-list-item button :ripple="false" slot="nested" v-for="(val,key,index) in sortedTrackData" v-if="!isNaN(val) && index" :key="'track'+key+index">
                            <mu-list-item-title>{{key}}</mu-list-item-title>
                            <mu-list-item-sub-title>{{val}}</mu-list-item-sub-title>
                        </mu-list-item>
                    </mu-list-item>
                </mu-list>
                <div id="features-chart-container">
                    <canvas id="features-chart"></canvas>
                </div>
            </mu-paper>
        </div>
    </mu-container>
</template>
<script>

    import {mapGetters,mapActions} from 'vuex';
    import anime from 'animejs';
    import spotifyMixin from '../mixins/spotify/index';


    const colors = [
        'rgba(30,215,96, 0.9)',
        'rgba(245,115,160, 0.9)',
        'rgba(80,155,245, 0.9)',
        'rgba(255,100,55, 0.9)',
        'rgba(180,155,200, 0.9)',
        'rgba(250,230,45, 0.9)',
        'rgba(0,100,80, 0.9)',
        'rgba(175,40,150, 0.9)',
        'rgba(30,50,100, 0.9)'
    ]

    let img = new Image;


    export default {
        name: 'analysis',
        mixins:[
            spotifyMixin
            ],
        data(){
            return {

                dummy_id:'5RLBZePs33aN2F8uCzcSeo',
                featuresChart:null,

                open: 'send',
                analysis:{
                    meta:null,
                    track:null,
                    bars:null,
                    beats:null,
                    sections:null,
                    segments:null,
                    tatums:null
                }
            }
        },
        computed:{
            ...mapGetters(['spotify','ws','rootAction']),

            sortedTrackData() {
                let res = {};
                let target = this.analysis.track;
                console.log(target);
                if(target) Object.keys(target).forEach(key => {if (key.indexOf('_confidence') === -1) res[key] = target[key]})
                //if(target) Object.keys(target).forEach(key => {if (target[key].indexOf('_confidence') === -1) res[key] = target[key]})
                return res;
            }
        },

        mounted(){

            if(!this.spotify.analysis){
                this.c_getAudioAnalysis(this.spotify.track.id,(res)=>{
                    console.log(res);
                    this.a_spotify(['set','analysis',res.data]);
                    this.a_index(['root','action','analysis']);

                    this.analysis = this.spotify.analysis;
                    if(!!window.player)  this.init(this.analysis);
                })
            }else{
                this.analysis = this.spotify.analysis;
                if(!!window.player)  this.init(this.analysis);
            }

         // this.analysis = this.spotify.analysis;
        },
        methods: {
            ...mapActions(['a_spotify','a_index']),



            init(data){

                function binaryIndexOf(searchElement, valueof, valueout) {
                    'use strict';

                    var minIndex = 0;
                    var maxIndex = this.length - 1;
                    var currentIndex;
                    var currentElement;

                    while (minIndex <= maxIndex) {
                        currentIndex = (minIndex + maxIndex) / 2 | 0;
                        currentElement = valueof(this[currentIndex]);

                        if (currentElement < searchElement && ((currentIndex + 1 < this.length) ? valueof(this[currentIndex+1]) : Infinity) > searchElement) {
                            return valueout(currentElement, currentIndex, this);
                        }
                        if (currentElement < searchElement) {
                            minIndex = currentIndex + 1;
                        }
                        else if (currentElement > searchElement) {
                            maxIndex = currentIndex - 1;
                        }
                        else {
                            return this[currentIndex];
                        }
                    }

                    return -1;
                }

                const getCurrentAndLastArrayLikes = (arrayLikes, time) => arrayLikes.map(arrayLike => binaryIndexOf.call(arrayLike, time, e => e.start, (element, index, array) => ([array[index], array[index > 0 ? index - 1 : 0]])));

                const getRowPosition = index => index === 0 ? 0 : 1 / index + getRowPosition(index-1);

                const getFloorRowPosition = (searchPosition, rowHeight, i = 0, max = 5) => i > max ? max : searchPosition < (getRowPosition(i + 1) * rowHeight) ? i : getFloorRowPosition(searchPosition, rowHeight, i + 1, max);


                this.featuresChart = document.getElementById('features-chart');
                this.featuresChart.style.width = this.featuresChart.offsetWidth;
                this.featuresChart.width = this.featuresChart.offsetWidth * 2;
                this.featuresChart.style.height = this.featuresChart.offsetHeight;
                this.featuresChart.height = this.featuresChart.offsetHeight * 2;

                const width = this.featuresChart.width;
                const height = this.featuresChart.height;
                const ctx = this.featuresChart.getContext("2d");

                const arrayLikesEntries = Object.entries(data).filter(entry => entry[1] instanceof Array).sort((a, b) => a[1].length - b[1].length)

                const arrayLikesKeys = arrayLikesEntries.map(entry => entry[0]);
                const arrayLikes = arrayLikesEntries.map(entry => entry[1]);

                console.log("arrayLikesKeys");
                console.log(arrayLikesKeys);

                console.log("arrayLikes");
                console.log(arrayLikes);

                const rowHeight = height / arrayLikes.length;

                arrayLikes.forEach((arrayLike, arrayLikeIndex) => {
                    const startY = getRowPosition(arrayLikeIndex) * rowHeight;
                    const arrayLikeHeight = rowHeight / (arrayLikeIndex + 1);

                    arrayLike.forEach((section, sectionIndex) => {
                        ctx.fillStyle = colors[sectionIndex % colors.length];
                        ctx.fillRect(section.start/data.track.duration*width, getRowPosition(arrayLikeIndex) * rowHeight, section.duration/data.track.duration*width, arrayLikeHeight);
                    });

                    const label = arrayLikesKeys[arrayLikeIndex].charAt(0).toUpperCase() + arrayLikesKeys[arrayLikeIndex].slice(1)
                    ctx.fillStyle = "#000";
                    ctx.font = `bold ${arrayLikeHeight}px Circular`;
                    ctx.fillText(label,0,startY + arrayLikeHeight);
                });

                const markerHeight = getRowPosition(arrayLikes.length) * rowHeight;

                let provideAnimationFrame=(timestamp)=> {


                        window.player && window.player.getCurrentState().then(state => {

                            if(!!state){



                            ctx.clearRect(0, 0, this.featuresChart.width, this.featuresChart.height);
                            ctx.drawImage(img,0,0);
                            ctx.fillStyle = "#000";

                            const position = state.position/1000/data.track.duration*width
                            ctx.fillRect(position-2, 0, 5, markerHeight);

                            const currentAndLastArrayLikes = getCurrentAndLastArrayLikes(arrayLikes, state.position/1000);
                            const pitchChanges = currentAndLastArrayLikes[3][0].pitches.map((pitch, index) => Math.abs(pitch - currentAndLastArrayLikes[3][1].pitches[index]));
                            const timbreChanges = currentAndLastArrayLikes[3][0].timbre.map((timbre, index) => Math.abs(timbre - currentAndLastArrayLikes[3][1].timbre[index]));

                            // Pitch boxes
                            const pitchBoxWidth = 60;
                            ctx.strokeStyle = "#AAA";
                            pitchChanges.forEach((pitchChange, i) => {
                                ctx.fillStyle = `hsl(0, 0%, ${pitchChange * 100}%)`;
                                ctx.fillRect(i*pitchBoxWidth,
                                    height - 2 * pitchBoxWidth,
                                    pitchBoxWidth,
                                    pitchBoxWidth);
                            });
                            timbreChanges.forEach((timbreChange, i) => {
                                ctx.fillStyle = `hsl(0, 0%, ${timbreChange * 100}%)`;
                                ctx.fillRect(i*pitchBoxWidth,
                                    height - 4 * pitchBoxWidth,
                                    pitchBoxWidth,
                                    pitchBoxWidth);
                            });
                            currentAndLastArrayLikes[3][0].pitches.forEach((pitchChange, i) => {
                                ctx.fillStyle = `hsl(0, 0%, ${pitchChange * 100}%)`;
                                ctx.fillRect(i*pitchBoxWidth,
                                    height - pitchBoxWidth,
                                    pitchBoxWidth,
                                    pitchBoxWidth);
                            });
                            currentAndLastArrayLikes[3][0].timbre.forEach((pitchChange, i) => {
                                ctx.fillStyle = `hsl(0, 0%, ${pitchChange * 100}%)`;
                                ctx.fillRect(i*pitchBoxWidth,
                                    height - 3 * pitchBoxWidth,
                                    pitchBoxWidth,
                                    pitchBoxWidth);
                            });

                            }

                            window.requestAnimationFrame(provideAnimationFrame);



                        }).catch(e => {
                            console.error("Animation: ", e);
                            window.requestAnimationFrame(provideAnimationFrame);
                        });


                }

                window.requestAnimationFrame(provideAnimationFrame);
                img.src = this.featuresChart.toDataURL('png');

            }
        },
        watch:{
            'rootAction':{
                handler(newAction){
                    if(newAction.type==='analysis') {
                        if(!this.spotify.analysis){
                            this.c_getAudioAnalysis(this.spotify.track.id,(res)=>{
                                console.log(res);
                                this.a_spotify(['set','analysis',res.data]);
                                this.a_index(['root','action','analysis']);

                                this.analysis = this.spotify.analysis;
                                if(!!window.player)  this.init(this.analysis);
                            })
                        }else{
                            this.analysis = this.spotify.analysis;
                            if(!!window.player)  this.init(this.analysis);
                        }
                    }
                },deep:true
            }
        }

    }
</script>


<style lang="scss" scoped>



</style>
