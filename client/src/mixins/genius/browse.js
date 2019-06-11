import axios from 'axios';

export default{
    methods: {
        c_genius_search(q,cb){
            let params =  {'q': q};
            axios.get('/api/genius/browse/search',{params:params}).then(
                res => {
                    cb(res);
                }
            ).catch(error => {
                console.log(error);
            });
        },

        c_genius_lyrics(q,cb){
            this.c_genius_search(q, res=>{
                if(res.data.length>0){
                    this.c_lyrics_from_url(res.data[0].result.url,res2=>{
                       cb({...res.data[0].result,lyrics:res2.data});
                    })
                }else{
                    cb(null);
                }
            })
        },

        c_lyrics_from_url(url,cb){
            let params =  {'url': url};
            axios.get('/api/genius/browse/lyricsbyurl',{params:params}).then(
                res => {
                    cb(res);
                }
            ).catch(error => {
                console.log(error);
            });
        }
    }
}
