const state = {

    modals:{
        how: {
            open: false,
            items: [
                {
                    thumb: '/static/img/design/circle1.jpg',
                    title: 'Emoryについて',
                    content: '『Emory』とは、観光名所やユニークなスポットに仕掛けられた「物語」を耳で楽しみながら進めてゆく街の魅力発見してゆくゲーミフィケーションWEBアプリケーションです。' +
                        '音楽ストリーミングサービスSpotifyのコンテンツと連動することで、豊かで楽しい時間が生まれます。'
                },
                {
                    thumb: '/static/img/design/circle2.jpg',
                    title: 'Emoryの仕組み',
                    content: '最新のブラウザに内蔵された緯度経度や角度センサーなどを利用してユーザーの位置を把握。バイノーラル録音による立体的な音響演出により、いつもの町歩きに未体験の驚きを提供します。'
                }
            ]
        },
        story:{
            open:false,
            items: [
                {
                    thumb: '/static/img/design/circle1.jpg',
                    title: '物語の始まり',
                    content: 'このエピソードを聞いてヒントを見つけよう！',
                    spotifyid:'62i1Q2wHMXyg3jcDo0M7r6',
                    spotifytype:'episode'
                },
                {
                    thumb: '/static/img/design/circle2.jpg',
                    title: 'スポット２',
                    content: 'この曲を聴いて答えを探そう！',
                    spotifyid:'7a3LbQFgp7NCuNcGlTgSsN',
                    spotifytype:'track'
                }
            ]
        }
    }
}

const mutations = {

    setModal(state,dat){
        if(dat.val==='toggle'){
            state.modals[dat.key].open = !state.modals[dat.key].open;
        }else{
            Object.keys(state.modals).forEach(key=>state.modals[key].open=false);
            state.modals[dat.key].open = dat.val;
        }
    },
}

export default {
    namespaced: true,
    state,
    mutations
}
