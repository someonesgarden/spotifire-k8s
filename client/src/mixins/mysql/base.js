import axios from 'axios';

export default{

    methods: {
        c_mysql_find(table,key,val,cb){
          axios.get('/api/mysql/'+table+'/get',{params:{key:key,val:val}}).then(res => {
              cb(res);
          }).catch(error => {
              console.log(error);
              cb(null);
          });
        }
    }
}

