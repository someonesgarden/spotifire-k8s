import axios from 'axios';

export default{

    methods: {
        c_mysql_lyrics_new(data,cb=null){
            const conditions = {
                spotifyid:  data.spotifyid,
                spotifytype:data.spotifytype,
                thumb:      data.thumb,
                artist:     data.primary_artist ? data.primary_artist.name : '',
                song:       data.full_title,
                type:       data.type,
                isrc:       data.isrc,
                lyrics:     data.lyrics,
                link:       data.link,
                morphs:     data.morphs
            };
            axios.post('/api/mysql/lyrics/new', conditions)
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

