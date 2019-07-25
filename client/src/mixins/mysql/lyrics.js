import axios from 'axios';

export default{
    methods: {
        c_mysql_lyrics_new(data,cb=null){

            let conditions = data;
            if(data.primary_artist) conditions.artist = data.primary_artist.name;
            //if(data.full_title) conditions.song = data.full_title;

            // const conditions = {
            //     spotifyid:  data.spotifyid,
            //     spotifytype:data.spotifytype,
            //     thumb:      data.thumb,
            //     genres:     data.genres,
            //     artist:     data.primary_artist ? data.primary_artist.name : '',
            //     song:       data.full_title,
            //     type:       data.type,
            //     isrc:       data.isrc,
            //     lyrics:     data.lyrics,
            //     link:       data.link,
            //     morphs:     data.morphs,
            //
            //     liveness:    data.liveness,
            //     valence:     data.valence,
            //     danceability:data.danceability,
            //     energy:      data.energy,
            //     acousticness:data.acousticness,
            //     tempo:       data.tempo,
            //     mode:        data.mode
            // };

            axios.post(window.dbDomain+'/api/mysql/lyrics/create', conditions)
                .then(res => {if (cb) cb(res)})
                .catch(error => { if (cb) cb(null)});
        },

        // c_mysql_lyrics_update(data,cb=null){
        //     const conditions = {
        //         id:data.id,
        //         spotifyids:  data.spotifyids,
        //         initial: data.initial
        //     };
        //     console.log(conditions);
        //     //axios.post('/api/mysql/initials/update', conditions)
        //     axios.post('https://spotifire.work/api/mysql/initials/update', conditions)
        //         .then(res => {
        //             console.log(res);
        //             if (cb) cb(res);
        //         }).catch(error => {
        //         console.log(error);
        //         if (cb) cb(null);
        //     });
        // }

    }
}

