import axios from 'axios';

export default{
    methods: {
        m_mapboxtoken() {
            axios.get('/api/props/tokens').then(res => this.a_mapstore(['mapbox','token',res.data.mapbox])).catch(error => console.log(error))
        }
    }
}
