export default{
    methods: {
        m_translatePoint(map, d) {
            let point = map.latLngToLayerPoint(new L.LatLng(d[1], d[0]));
            return "translate(" + point.x + "," + point.y + ")";
        },

        m_coordToLatLon(map, coord) {
            return map.layerPointToLatLng(new L.Point(coord[0], coord[1]));
        },

        m_pathStartPoint(_path) {
            let d = _path.attr('d');
            let dsplitted = d.split("L")[0].slice(1).split(",");
            return [
                parseInt(dsplitted[0]),
                parseInt(dsplitted[1])
            ];
        }
    }
}
