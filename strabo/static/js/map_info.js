// Initialize custom GPS location icon
var locateIcon = L.icon({
    iconUrl: '/static/locationDot.png',
    iconSize: [20,20]
});

var ColorIcon = L.Icon.extend({
    options: {
        shadowUrl: '/static/MapPinShadow.png',
        iconSize:     [30, 50],
        shadowSize:   [30, 32],
        iconAnchor:   [15, 50],
        shadowAnchor: [2, 30],
        popupAnchor:  [-3, -50]
    }
});

var iconObjs = function(){
    var icon_objs = {};
        straboconfig["MAP_ICONS"].forEach(function(icon_name){
        icon_objs[icon_name] = new ColorIcon({iconUrl:'/static/map_icons/' + icon_name});
    });
    return icon_objs;
}();

// creates leaflet map object
function make_map(map_container_id){
    return L.map(map_container_id, {}).setView([straboconfig["LAT_SETTING"], straboconfig["LONG_SETTING"]], straboconfig["INITIAL_ZOOM"]);
}
function add_tile_to(map){
    L.tileLayer(straboconfig["MAP_TILE_SRC"],straboconfig["LEAFLET_ATTRIBUTES"]).addTo(map);
}
function make_all_layers_group(interest_point_geojson_list){
    return L.geoJson(interest_point_geojson_list)
}
// sets icon object for points and stlying for zones
function set_styles(all_layers_group){
    var all_layers = all_layers_group.getLayers();

    var points = all_layers.filter(function(lay){return lay.feature.geometry.type == "Point"});
    var zones = all_layers.filter(function(lay){return lay.feature.geometry.type == "Polygon"});

    zones.forEach(function(zone){
        zone.setStyle({
              weight: 1,
              //color: zone.feature.properties['marker-color'],
              dashArray: '',
              fillOpacity: 0.3
        });
    });
    points.forEach(function(point){
        point.setIcon(iconObjs[aa.feature.properties.icon]);
    })
}
function place_overlays_on(all_layers_group,map){
    // Set layers and add toggle control menu for each layer,
    //NOTE: will not work if all_layers_group is added to the map elsewhere
    var all_layers = all_layers_group.getLayers();
    var overlays = {};
    for(var lay_num in straboconfig["LAYER_FIELDS"]){
        var lays = all_layers.filter(function(lay){return lay.feature.properties.layer == lay_num});
        var laygroup = L.layerGroup(lays);
        laygroup.addTo(map);
        var lay_name = straboconfig["LAYER_FIELDS"][lay_num];
        overlays[lay_name] = laygroup;
    }
    L.control.layers(null, overlays).addTo(map);
}
//makes it so that popups appear when clicked with the interest point database id
function bind_popups(all_layers_group){
    var all_layers = all_layers_group.getLayers();
    all_layers.forEach(function(layer){
        layer.bindPopup(layer.feature.properties.name);
    });
}
