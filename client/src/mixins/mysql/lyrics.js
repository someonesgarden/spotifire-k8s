import axios from 'axios';

export default{

    methods: {
        c_mysql_lyrics_new(data,cb=null){

            console.log("c_mysql_lyrics_new:spotifire.work!!");
            console.log(data);
            const conditions = {
                spotifyid:  data.spotifyid,
                spotifytype:data.spotifytype,
                thumb:      data.thumb,
                genres:     data.genres,
                artist:     data.primary_artist ? data.primary_artist.name : '',
                song:       data.full_title,
                type:       data.type,
                isrc:       data.isrc,
                lyrics:     data.lyrics,
                link:       data.link,
                morphs:     data.morphs,

                liveness:    data.liveness,
                valence:     data.valence,
                danceability:data.danceability,
                energy:      data.energy,
                acousticness:data.acousticness,
                tempo:       data.tempo,
                mode:        data.mode
            };
            // axios.post('/api/mysql/lyrics/new', conditions)
            axios.post('https://spotifire.work/api/mysql/lyrics/create', conditions)
                .then(res => {
                    console.log(res);
                    if (cb) cb(res);
                }).catch(error => {
                console.log(error);
                if (cb) cb(null);
            });
        }

    }
}

