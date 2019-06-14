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
                    content: 'これはテストの文章です。親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。'
                }
            ]
        },
        story:{
            open:false,
            items: [
                {
                    thumb: '/static/img/design/circle2.jpg',
                    title: 'テスト',
                    content: 'これはテストの文章です。親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。'
                },
                {
                    thumb: '/static/img/design/circle2.jpg',
                    title: 'テスト',
                    content: 'これはテストの文章です。親譲りの無鉄砲で小供の時から損ばかりしている。小学校に居る時分学校の二階から飛び降りて一週間ほど腰を抜かした事がある。'
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
