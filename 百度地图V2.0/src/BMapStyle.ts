import mapStyle = require("./IMapStyle");

/**
 * 贴地点功能实现
 */
export class BMapStyle implements mapStyle.IMapStyle {
    public mapStyle(stl) {
        switch (stl) {
            case 'def':
                return [];
                break;
            case 'darkStyle':
                return this.darkStyle();
                break;
            case 'purpleStyle':
                return this.purpleStyle();
                break;
            case 'whiteStyle':
                return this.whiteStyle();
                break;
            case 'goldStyle':
                return this.goldStyle();
                break;
            case 'greenStyle':
                return this.greenStyle();
                break;
            case 'blueStyle':
                return this.blueStyle();
                break;
            default:
                return [];
                break;
        }
    }

    /**
     * 暗夜黑
     * @private
     */
    private darkStyle(){
        return [
            {
                featureType: 'background',
                elementType: 'geometry',
                stylers: {
                    color: '#070c17ff'
                }
            }, {
                featureType: 'poilabel',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'road',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#151e25ff'
                }
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#27303bff'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'nationalway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#27303bff'
                }
            }, {
                featureType: 'nationalway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'provincialway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#27303bff'
                }
            }, {
                featureType: 'provincialway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'highwaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'highwaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'nationalwaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'nationalwaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'provincialwaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'provincialwaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'tertiarywaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'tertiarywaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'subwaylabel',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'subwaylabel',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'poilabel',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#80868dff'
                }
            }, {
                featureType: 'poilabel',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'districtlabel',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#71767aff'
                }
            }, {
                featureType: 'districtlabel',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'poilabel',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'airportlabel',
                elementType: 'labels',
                stylers: {
                    visibility: 'on'
                }
            }, {
                featureType: 'airportlabel',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'airportlabel',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#80868dff'
                }
            }, {
                featureType: 'airportlabel',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'manmade',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'manmade',
                elementType: 'geometry',
                stylers: {
                    color: '#070c17ff'
                }
            }, {
                featureType: 'water',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'water',
                elementType: 'geometry',
                stylers: {
                    color: '#141d27ff'
                }
            }, {
                featureType: 'green',
                elementType: 'geometry',
                stylers: {
                    color: '#122228ff',
                    visibility: 'off'
                }
            }, {
                featureType: 'subway',
                elementType: 'geometry',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'highway',
                elementType: 'labels',
                stylers: {
                    visibility: 'on'
                }
            }, {
                featureType: 'highway',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'highway',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#5f6468ff'
                }
            }, {
                featureType: 'town',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'village',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry',
                stylers: {
                    weight: 3
                }
            }, {
                featureType: 'cityhighway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#27303bff'
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#27303bff'
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }, {
                featureType: 'cityhighway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#ffffff00'
                }
            }];
    }

    /**
     * 高级灰
     * @private
     */
    private purpleStyle(){
        return [
            {
                featureType: 'water',
                elementType: 'all',
                stylers: {
                    color: '#021019ff'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#000000ff'
                }
            }, {
                featureType: 'highway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#147a92ff'
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#000000ff'
                }
            }, {
                featureType: 'arterial',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#0b3d51ff'
                }
            }, {
                featureType: 'local',
                elementType: 'geometry',
                stylers: {
                    color: '#000000ff'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#000000ff'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#08304bff'
                }
            }, {
                featureType: 'subway',
                elementType: 'geometry',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#857f7fff'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#000000ff'
                }
            }, {
                featureType: 'green',
                elementType: 'geometry',
                stylers: {
                    color: '#062032ff'
                }
            }, {
                featureType: 'manmade',
                elementType: 'geometry',
                stylers: {
                    color: '#022338ff'
                }
            }, {
                featureType: 'poilabel',
                elementType: 'all',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'all',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'water',
                elementType: 'all',
                stylers: {
                    visibility: 'on',
                    color: '#505565ff'
                }
            }, {
                featureType: 'green',
                elementType: 'all',
                stylers: {
                    color: '#353b4dff'
                }
            }, {
                featureType: 'road',
                elementType: 'geometry.fill',
                stylers: {
                    visibility: 'on',
                    color: '#2a2e3bff'
                }
            }, {
                featureType: 'road',
                elementType: 'geometry.stroke',
                stylers: {
                    color: '#4b5163ff'
                }
            }, {
                featureType: 'administrative',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#8e99bdff'
                }
            }, {
                featureType: 'administrative',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#2f3547ff'
                }
            }, {
                featureType: 'poilabel',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#727c9aff'
                }
            }, {
                featureType: 'road',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#293045ff'
                }
            }, {
                featureType: 'road',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#777e93ff'
                }
            }, {
                featureType: 'town',
                elementType: 'all',
                stylers: {
                    visibility: 'on'
                }
            }, {
                featureType: 'subway',
                elementType: 'labels.text.fill',
                stylers: {
                    visibility: 'off',
                    color: '#787f95ff'
                }
            }, {
                featureType: 'subway',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#40475eff'
                }
            }, {
                featureType: 'building',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#485161ff'
                }
            }, {
                featureType: 'manmade',
                elementType: 'geometry.fill',
                stylers: {
                    color: '#374053ff'
                }
            }, {
                featureType: 'manmade',
                elementType: 'labels.text.fill',
                stylers: {
                    color: '#8792adff'
                }
            }, {
                featureType: 'manmade',
                elementType: 'labels.text.stroke',
                stylers: {
                    color: '#292f48ff'
                }
            }, {
                featureType: 'scenicspotslabel',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'railway',
                elementType: 'geometry',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'scenicspotslabel',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'highwaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'highwaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'nationalwaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'nationalwaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'provincialwaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'provincialwaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'tertiarywaysign',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'tertiarywaysign',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'subwaylabel',
                elementType: 'labels.icon',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'subwaylabel',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'village',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'town',
                elementType: 'labels',
                stylers: {
                    visibility: 'off'
                }
            }, {
                featureType: 'land',
                elementType: 'geometry',
                stylers: {
                    color: '#40495aff',
                    visibility: 'on'
                }
            }];
    }

    /**
     * 一蓑烟雨
     * @private
     */
    private whiteStyle(){
        return [{
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#ccd6d7ff"
            }
        }, {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#dee5e5ff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.topfill",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.sidefill",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#aab6b6ff"
            }
        }, {
            "featureType": "subwaystation",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "color": "#888fa0ff"
            }
        }, {
            "featureType": "education",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#e1e7e7ff"
            }
        }, {
            "featureType": "medical",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 4
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 2
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 1
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9494941a"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff1a"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#c3bed433"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff33"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#979c9aff"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#333333ff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#454d50ff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "town",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#454d50ff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "road",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#888fa0ff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "otherlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "village",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
                "color": "#edf3f3ff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#cacfcfff"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,8",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,8",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,8",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8f5a33ff"
            }
        }, {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8f5a33ff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text",
            "stylers": {
                "fontsize": 28
            }
        }, {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#dfe7e7ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#fbfffeff"
            }
        }, {
            "featureType": "manmade",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "manmade",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "scenicspotslabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "scenicspotslabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "medicallabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "medicallabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "hotellabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "hotellabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "shoppinglabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "shoppinglabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportationlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportationlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "entertainment",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "estate",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "shopping",
            "elementType": "geometry",
            "stylers": {
                "color": "#d1dbdbff"
            }
        }, {
            "featureType": "education",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "education",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "medical",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "medical",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#999999ff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }];
    }

    /**
     * 高贵金
     * @private
     */
    private goldStyle(){
        return [
            {
                "featureType": "land",
                "elementType": "geometry",
                "stylers": {
                    "color": "#232323ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#232323ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "building",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#181714ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "building",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#090500ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "village",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "town",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "district",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "country",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "city",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "continent",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "poilabel",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "poilabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "scenicspotslabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "scenicspotslabel",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "transportationlabel",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "transportationlabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "airportlabel",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "airportlabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": {
                    "weight": 3
                }
            }, {
                "featureType": "green",
                "elementType": "geometry",
                "stylers": {
                    "color": "#5b5753ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "scenicspots",
                "elementType": "geometry",
                "stylers": {
                    "color": "#232323ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "scenicspots",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "scenicspots",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "weight": 1,
                    "color": "#5d5b54ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "continent",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "country",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "city",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "city",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "scenicspotslabel",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "airportlabel",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "transportationlabel",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "railway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "subway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "highwaysign",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "nationalwaysign",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "nationalwaysign",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "provincialwaysign",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "provincialwaysign",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "tertiarywaysign",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "tertiarywaysign",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "subwaylabel",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "subwaylabel",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on",
                    "weight": 90
                }
            }, {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "shopping",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "scenicspots",
                "elementType": "labels",
                "stylers": {
                    "visibility": "on"
                }
            }, {
                "featureType": "scenicspotslabel",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "manmade",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "manmade",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "highwaysign",
                "elementType": "labels.icon",
                "stylers": {
                    "visibility": "off"
                }
            }, {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5b575300",
                    "visibility": "on"
                }
            }, {
                "featureType": "road",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "road",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "road",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "road",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "road",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "road",
                "elementType": "labels.text",
                "stylers": {
                    "fontsize": 24
                }
            }, {
                "featureType": "highway",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#1c4f7eff"
                }
            }, {
                "featureType": "highway",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                    "weight": 3
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#1c4f7eff"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry",
                "stylers": {
                    "weight": 3
                }
            }, {
                "featureType": "provincialway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "tertiaryway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "fourlevelway",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "local",
                "elementType": "geometry.fill",
                "stylers": {
                    "color": "#50422fff",
                    "visibility": "on"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "tertiaryway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "fourlevelway",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "local",
                "elementType": "geometry.stroke",
                "stylers": {
                    "color": "#321f07ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "local",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "local",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "fourlevelway",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "tertiaryway",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "arterial",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "labels.text.fill",
                "stylers": {
                    "color": "#7a6237ff",
                    "visibility": "on"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "arterial",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "tertiaryway",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "fourlevelway",
                "elementType": "labels.text.stroke",
                "stylers": {
                    "color": "#5d5b54ff",
                    "visibility": "on",
                    "weight": 1
                }
            }, {
                "featureType": "fourlevelway",
                "elementType": "geometry",
                "stylers": {
                    "weight": 1
                }
            }, {
                "featureType": "tertiaryway",
                "elementType": "geometry",
                "stylers": {
                    "weight": 1
                }
            }, {
                "featureType": "local",
                "elementType": "geometry",
                "stylers": {
                    "weight": 1
                }
            }, {
                "featureType": "provincialway",
                "elementType": "geometry",
                "stylers": {
                    "weight": 3
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry",
                "stylers": {
                    "weight": 3
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry",
                "stylers": {
                    "weight": 3
                }
            }, {
                "featureType": "highway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "highway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "highway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "highway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "highway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "highway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "nationalway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "nationalway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "nationalway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "nationalway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "nationalway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "provincialway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "8,10",
                    "level": "8"
                }
            }, {
                "featureType": "provincialway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "8,10",
                    "level": "9"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "8,10",
                    "level": "8"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "8,10",
                    "level": "9"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "8,10",
                    "level": "8"
                }
            }, {
                "featureType": "provincialway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "8,10",
                    "level": "9"
                }
            }, {
                "featureType": "cityhighway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "cityhighway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "cityhighway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "cityhighway",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "6"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "7"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "8"
                }
            }, {
                "featureType": "cityhighway",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "6,9",
                    "level": "9"
                }
            }, {
                "featureType": "arterial",
                "stylers": {
                    "curZoomRegionId": "0",
                    "curZoomRegion": "9,9",
                    "level": "9"
                }
            }, {
                "featureType": "arterial",
                "elementType": "geometry",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "9,9",
                    "level": "9"
                }
            }, {
                "featureType": "arterial",
                "elementType": "labels",
                "stylers": {
                    "visibility": "off",
                    "curZoomRegionId": "0",
                    "curZoomRegion": "9,9",
                    "level": "9"
                }
            }]
    }

    /**
     * 绿野仙踪
     * @private
     */
    private greenStyle()    {
        return [
            {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
                "color": "#242f3eff"
            }
        }, {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#242f3eff"
            }
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
                "color": "#17263cff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9e7d60ff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#554631ff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d69563ff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#17263cff",
                "weight": 3
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d69563ff"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#17263cff",
                "weight": 3
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "color": "#263b3eff"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d0021bff"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d69563ff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#17263cff"
            }
        }, {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d69563ff"
            }
        }, {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#242f3eff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#38414eff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "fourlevelway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#38414eff"
            }
        }, {
            "featureType": "fourlevelway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#38414eff"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "fourlevelway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9e7d60ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#554631ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9e7d60ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#554631ff"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "fourlevelway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9e7d60ff"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#554631ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9e7d60ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#554631ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9e7d60ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#554631fa"
            }
        }, {
            "featureType": "medicallabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "medicallabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "entertainmentlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "entertainmentlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "estatelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "estatelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "businesstowerlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "businesstowerlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "governmentlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "governmentlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "hotellabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "hotellabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "shoppinglabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "shoppinglabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "otherlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "otherlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d69563ff"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#17263cff"
            }
        }, {
            "featureType": "airportlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,9",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,9",
                "level": "9"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,9",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,9",
                "level": "9"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,9",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,9",
                "level": "9"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "arterial",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "9,10",
                "level": "9"
            }
        }, {
            "featureType": "arterial",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "9,10",
                "level": "10"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "9,10",
                "level": "9"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "9,10",
                "level": "10"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "9,10",
                "level": "9"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "9,10",
                "level": "10"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.topfill",
            "stylers": {
                "color": "#2a3341ff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.sidefill",
            "stylers": {
                "color": "#313b4cff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#1a212eff"
            }
        }, {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#759879ff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#1a2e1cff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "manmade",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#d69563ff"
            }
        }, {
            "featureType": "manmade",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#17263cff"
            }
        }, {
            "featureType": "subwaystation",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportationlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "transportationlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "estate",
            "elementType": "geometry",
            "stylers": {
                "color": "#2a3341ff"
            }
        }];
    }

    /**
     * 青花瓷
     */
    public blueStyle(){
        return [
            {
            "featureType": "land",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#f1f1f1ff"
            }
        }, {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#54afebff"
            }
        }, {
            "featureType": "green",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#65a7fcff"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.topfill",
            "stylers": {
                "color": "#ffffffb3"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.sidefill",
            "stylers": {
                "color": "#ffffffb3"
            }
        }, {
            "featureType": "building",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#dadadab3"
            }
        }, {
            "featureType": "subwaystation",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#b15454B2"
            }
        }, {
            "featureType": "education",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#cdebffff"
            }
        }, {
            "featureType": "medical",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#cdebffff"
            }
        }, {
            "featureType": "scenicspots",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "color": "#cdebffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 4
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#9dcaffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#fed66900"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#8f5a33ff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 2
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#428ee9ff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#428ee900"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "arterial",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on",
                "weight": 1
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#979c9aff"
            }
        }, {
            "featureType": "local",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#949494ff"
            }
        }, {
            "featureType": "railway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "weight": 1
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#d8d8d8ff"
            }
        }, {
            "featureType": "subway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#979c9aff"
            }
        }, {
            "featureType": "subway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#333333ff"
            }
        }, {
            "featureType": "continent",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "city",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "city",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff",
                "weight": 3
            }
        }, {
            "featureType": "town",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "town",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#454d50ff"
            }
        }, {
            "featureType": "town",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#bddbfdff"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff",
                "weight": 3
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "manmade",
            "elementType": "geometry",
            "stylers": {
                "color": "#cdebffff"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "restaurantlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "lifeservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "carservicelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "financelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "otherlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "otherlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "companylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "businesstowerlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "businesstowerlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "estatelabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "estatelabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "highwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "provincialwaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "tertiarywaysign",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "subwaylabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#78b6ffff"
            }
        }, {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#69acffff"
            }
        }, {
            "featureType": "entertainment",
            "elementType": "geometry",
            "stylers": {
                "color": "#cdebffff"
            }
        }, {
            "featureType": "estate",
            "elementType": "geometry",
            "stylers": {
                "color": "#cdebffff"
            }
        }, {
            "featureType": "shopping",
            "elementType": "geometry",
            "stylers": {
                "color": "#cdebffff"
            }
        }, {
            "featureType": "transportation",
            "elementType": "geometry",
            "stylers": {
                "color": "#cdebffff"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "tertiaryway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff"
            }
        }, {
            "featureType": "village",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "district",
            "elementType": "labels.text",
            "stylers": {
                "fontsize": 20
            }
        }, {
            "featureType": "district",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "district",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "highway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "nationalway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "6"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "7"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "8"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "9"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,10",
                "level": "10"
            }
        }, {
            "featureType": "district",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "8"
            }
        }, {
            "featureType": "district",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "9"
            }
        }, {
            "featureType": "district",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "10"
            }
        }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "8"
            }
        }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "9"
            }
        }, {
            "featureType": "district",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "10"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "9"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "9"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "6"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "7"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "8"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "curZoomRegion": "6,9",
                "level": "9"
            }
        }, {
            "featureType": "districtlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "country",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff",
                "weight": 6
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "nationalway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#8ec1ffff"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "governmentlabel",
            "elementType": "labels",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "governmentlabel",
            "elementType": "labels.icon",
            "stylers": {
                "visibility": "off"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "educationlabel",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff",
                "weight": 3
            }
        }, {
            "featureType": "fourlevelway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "on"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.fill",
            "stylers": {
                "color": "#c8e1ffff"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry.stroke",
            "stylers": {
                "color": "#ffffff00"
            }
        }, {
            "featureType": "poilabel",
            "elementType": "labels.text",
            "stylers": {
                "fontsize": 20
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.fill",
            "stylers": {
                "color": "#ffffffff"
            }
        }, {
            "featureType": "cityhighway",
            "elementType": "labels.text.stroke",
            "stylers": {
                "color": "#428ee9ff",
                "weight": 3
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "9"
            }
        }, {
            "featureType": "provincialway",
            "stylers": {
                "curZoomRegionId": "0",
                "curZoomRegion": "8,10",
                "level": "10"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "weight": 3,
                "curZoomRegion": "8,10",
                "level": "8"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "weight": 3,
                "curZoomRegion": "8,10",
                "level": "9"
            }
        }, {
            "featureType": "provincialway",
            "elementType": "geometry",
            "stylers": {
                "visibility": "off",
                "curZoomRegionId": "0",
                "weight": 3,
                "curZoomRegion": "8,10",
                "level": "10"
            }
        }
        ];
    }
}