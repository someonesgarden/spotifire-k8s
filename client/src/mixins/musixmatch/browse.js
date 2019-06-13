import axios from 'axios';

export default{
    methods: {
        c_mm_lyrics_isrc(isrc,track_name,cb){
            let params =  {isrc: isrc, track_name:track_name};
            //http://127.0.0.1:8080/api/musicbrainz/browse/searchTrackInRecording?isrc=USWB10001880&track_name=Purple%20Rain

            axios.get('/api/musicbrainz/browse/searchTrackInRecording',{params:params}).then(
                res => {
                    let total = res.data.length>10 ? 10 : res.data.length;
                    if(total>0){
                        console.log("mbid num is"+res.data.length+". so, I will use "+total);

                        let queries = [];
                        //とりあえず１０回以内に抑える。。1日２０００回までなので。。
                        for(let i=0;i<total;i++){
                            console.log("mbid:",res.data[i].id);
                            queries.push(axios.get('/api/musixmatch/track/trackLyrics', {params: {mbid: res.data[i].id}}))
                        }

                        Promise.all(queries).then(responses=>{
                            let results = responses.filter(res=> res.data && res.data.message.header.status_code!=404);
                            if(results.length>0){
                                //結果が十分にある場合は、歌詞は同じなので一つだけ掘り下げて返す
                                cb(results[0].data.message.body);
                            }else{
                                cb(null);
                            }
                        }).catch(error => console.log(error))
                    }else{
                        cb(null);
                    }
                }
            ).catch(error => {
                console.log(error);
                cb(null);
            });
        }
    }
}