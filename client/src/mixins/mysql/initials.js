import axios from 'axios';

export default{
    methods: {
        c_mysql_initials_new(data,cb=null){
            const conditions = {
                spotifyids:  data.spotifyids,
                initial: data.initial,
                genres:data.genres
            };

            axios.post(window.dbDomain+'/api/mysql/initials/create', conditions)
                .then(res => {
                    console.log(res);
                    if (cb) cb(res);
                }).catch(error => {
                console.log(error);
                if (cb) cb(null);
            });
        },

        c_mysql_initials_update(data,cb=null){
            const conditions = {
                id:data.id,
                spotifyids:  data.spotifyids,
                initial: data.initial
            };
            console.log(conditions);
            //axios.post('/api/mysql/initials/update', conditions)
            axios.post(window.dbDomain+'/api/mysql/initials/update', conditions)
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

