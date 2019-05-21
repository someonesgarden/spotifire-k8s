import {mapActions} from 'vuex';
import axios from 'axios';

export default{
    methods: {
        ...mapActions(['a_feed']),

        async kuromojiParse(q='詩は金融市場とは無縁ですが、詩をお金の力が届かない聖域に祭り上げるのも、誤魔化しのように思えます。') {
            return  await axios.post('/api/analyze/parser/kuromoji', {q:q});
        }
    }
}
