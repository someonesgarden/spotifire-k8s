import axios from 'axios';

export default{

    methods: {

        c_mysql_getall(table,cb=null){
            axios.get(window.dbDomain+'/api/mysql/'+table+'/all').then(res => {
                console.log(res);
                if(cb) cb(res);
            }).catch(error => {
                console.log(error);
                if(cb) cb(null);
            });
        },

        c_mysql_find(table,key,val,cb){
          axios.get(window.dbDomain+'/api/mysql/'+table+'/get',{params:{key:key,val:val}}).then(res => {
              cb(res);
          }).catch(error => {
              console.log(error);
              cb(null);
          });
        },


        c_trackLyricsByMusixMatch(isrc,track_name){
            this.c_mm_lyrics_isrc(isrc,track_name,res=>{
                console.log(res);
                if(res){
                    this.a_genius(['set','song',{
                        full_title:track_name,
                        lyrics:res.lyrics.lyrics_body,
                        id:isrc,type:'musixmatch'
                    }]);
                    this.a_spotify(['update', 'item', 'lyrics']);
                }
            })
        },

        getLyricsFromTrackID(trackid){
          this.c_getTrack(trackid,(res)=>{
              let track = res.data;
              this.getLyrics(
                  {
                      name:track.name,
                      id:track.id,
                      artistid:track.artists[0].id,
                      artist:track.artists[0].name,
                      thumb:track.album.images[0].url,
                      isrc:track.external_ids.isrc
                  }
              );
          })
        },

        getLyrics(track,cb=null){

            //Get Initial
            this.c_mysql_find('initials','initial',track.name.slice(0,1), res=>{

                if(res.data.length===0){
                    console.log("no initial found");

                    this.c_getArtist(track.artistid,a_res=> {
                        let genres = JSON.stringify(a_res.data.genres);

                        this.c_mysql_initials_new({
                            initial:track.name.slice(0,1),
                            spotifyids:track.id,
                            genres:genres
                        }, res_=> this.a_subscribe(['set','update','initials']))
                    });

                }else{
                    console.log("initial found!");

                    if(res.data[0].spotifyids.indexOf(track.id)===-1){
                        console.log("同じイニシャルはあるが、trackは登録されていない場合、作成する");

                        this.c_mysql_initials_update({
                            id:res.data[0].id,
                            initial:track.name.slice(0,1),
                            spotifyids:track.id+"|"+res.data[0].spotifyids
                        },res_=> this.a_subscribe(['set','update','initials']))
                    }
                }
            })

            //Get Lyrics
            this.c_mysql_find('lyrics','spotifyid',track.id, res=>{

                console.log('spotifyid',track.id);
                if(res.data.length===0) {
                    console.log("not saved!");
                    console.log(track.artistid);
                    this.c_getArtist(track.artistid,a_res=>{
                        let genres = JSON.stringify(a_res.data.genres);

                        console.log(genres);

                        this.c_kget(track,k_res=>{

                            if(k_res.lyrics){
                                console.log("歌詞GETに見つかりました！");

                                if(cb) cb(k_res);

                                this.c_getTrack(track.id,(g_res)=>{
                                    this.kuromojiParse(k_res.lyrics).then((res2) => {
                                        let freqs = this.getFreqs(res2.data,60);

                                        freqs = JSON.stringify(freqs);

                                        this.c_mysql_lyrics_new(
                                            {...track,
                                                ...k_res,
                                                type:"kget",
                                                morphs:freqs,
                                                liveness:g_res.data.features.liveness,
                                                valence:g_res.data.features.valence,
                                                danceability:g_res.data.features.danceability,
                                                energy:g_res.data.features.energy,
                                                acousticness:g_res.data.features.acousticness,
                                                tempo:g_res.data.features.tempo,
                                                mode:g_res.data.features.mode,
                                                genres:genres
                                            }, res_=> this.a_subscribe(['set','update','lyrics']));
                                    })
                                });
                                return;
                            }
                            console.log("歌詞GETにはありませんでした。",track.isrc,track.name);
                            if(cb) cb(null);

                            // this.c_mm_lyrics_isrc(track.isrc,track.name,res=>{
                            //
                            //     if(res){
                            //         console.log("musixmatchに歌詞を見つけました！");
                            //         console.log(res);
                            //         return;
                            //     }
                            //     console.log("musixmatchに歌詞はりませんでした");
                            // })
                        })
                    });

                }else{
                    console.log(res.data.length+"songs already there!");
                }
            });
        }
    }
}

