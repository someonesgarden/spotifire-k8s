import {mapActions} from 'vuex';
import axios from 'axios';

export default{
    methods: {
        ...mapActions(['a_feed']),

        // kuromojiParse(q='') {
        //
        //     let params = new URLSearchParams();
        //     params.append('data', "test123");
        //     axios.post('https://spotifire.work/api/form/contactinfo', params)
        //         .then(res => {
        //             console.log('OK');
        //             console.log(res);
        //         }).catch(error => {
        //         console.log(error);
        //     });
        // },

        async kuromojiParse(q="") {

            // q='広島'

            return await axios.post('/api/analyze/parser/kuromoji', {q:q});
        },

        getFreqs(tokens,limit=5){

            let over4length = [];
            let top5        = [];

            // const TARGET_POS = ['名詞', '動詞', '形容詞'];
            const TARGET_POS = ['名詞', '形容詞'];
            const NO_CONTENT = '*';
            const freqWords = tokens
            // pos（品詞）を参照し、'名詞', '動詞', '形容詞'のみを抽出
                .filter(t => TARGET_POS.includes(t.pos))
                // 単語を抽出(basic_formかsurface_formに単語が存在する)
                .map(t => t.basic_form === NO_CONTENT ? t.surface_form : t.basic_form)
                // [{text: 単語, value: 出現回数}]の形にReduce
                .reduce((data, text) => {
                    const target = data.find(c => c.text === text)
                    if(target) {
                        target.value = target.value + 1
                    } else {
                        data.push({text, value: 1})
                    }
                    return data
                }, []);

            //一文字だけの単語は除去・四文字以上は特別扱い
            let freqWords2 = [];
            freqWords.map(word=>{ if(word.text.length>1){
                freqWords2.push(word);
                if(word.text.length>3) over4length.push(word.text);
            } });
            freqWords2.sort((a,b)=> b.value - a.value);

            //トップ５を抽出
            freqWords2.forEach((d,i)=> {if(i<limit) top5.push(d.text)});

            let temp  = [...top5,...over4length];
            let temp2 = temp.filter((d)=> !this.isNumber(d));
            let temp3 = temp2.filter((d)=> !this.isSpecialCharas(d));
            let temp4 = temp3.filter((d)=> !this.isHiragana(d));

            return temp4.filter((x, i, self)=> self.indexOf(x) === i);
        }
    }
}

