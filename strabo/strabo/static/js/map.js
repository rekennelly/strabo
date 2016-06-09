//flickety object
var flkty;
var map; 
// var map;

//is called whenever a leafelet feature is clicked
function whenClicked(e) {
    ip_clicked(e.target.feature.geometry.db_id);
}

function hide_popup(){
    $('.popup').hide();
    $('.popup-background').hide();
}
function show_popup(){
    $('.popup').show();
    $('.popup-background').show();
}

//this function loads the text and images associated
//with a selected interest point
//example output:
// <div class="carousel-cell"><img src= "static/thumbnails/download.jpg"/></div>
function get_carosel_html(filename,descrip){
    var html = '<div class="carousel-cell">';
    html += '<img src="static/thumbnails/' + filename + '"/>';
    html += '<p>' + descrip + '</p>';
    html += '</div>';
    return html;
}
function remove_all_carosel_entries(){
    flkty.remove(flkty.getCellElements());
}
//adds all the imag data to the garosel in the oder
function add_carosel_entries(imgs){
    var carousel_html = "";
    imgs.forEach(function(img){
        var $cellElems = $(get_carosel_html(img.filename,img.description));
        flkty.append($cellElems);
    });
}
//brings up popup associated with feature ip
function ip_clicked(db_id) {
    //sends a request to the server tp return the information associated with the
    // database feature id
    $.post(
        "/map/post",
        {db_id:db_id},
        function(data){
            var imgs = data.images;
            var ip_descrip = data.description;
            var ip_title = data.title;

            //renders the popup
            show_popup();

            remove_all_carosel_entries();

            add_carosel_entries(imgs);

            $("#ip_description").html(ip_descrip);
            $("#ip_title").html(ip_title);

            // resize after un-hiding Flickity
            flkty.resize();
            flkty.reposition();
        }
    );
}
//sets the popup feature when you click a spot on the map
function set_map_click(map){
    // Display latlng info for any place on the map when clicked
    function onMapClick(e) {
       L.popup()
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
    }
    // Trigger onMapClick function whenever map is clickeddb_id
    map.on('click', onMapClick);
}

// set styles and popups for zones
function onEachZone(feature, layer) {
  layer.bindPopup(feature.geometry.db_id.toString());
  layer.setStyle({
        weight: 1,
        color: feature.properties['marker-color'],
        dashArray: '',
        fillOpacity: 0.3
  });
  layer.on({
      click: whenClicked
  });
}
// set styles and popups for lines
function onEachLine(feature, layer) {
  layer.bindPopup(feature.geometry.db_id.toString());
  layer.setStyle({
        weight: 4,
        color: feature.properties['marker-color'],
        dashArray: '',
  });
  layer.on({
      click: whenClicked
  });
}
// set styles and popups for points
function onEachPoint(feature, layer) {
  layer.bindPopup(feature.geometry.db_id.toString());
  // layer.setIcon(feature.properties['icon']);
  layer.on({
      click: whenClicked
  });
}

//this function loads the text and images associated
//with a selected interest point
//example output:
// <div class="carousel-cell"><img src= "static/thumbnails/download.jpg"/></div><div class="carousel-cell"><img src= "static/thumbnails/download1.jpg"/></div><div class="carousel-cell"><img src= "static/thumbnails/download2.jpg"/></div>
function get_carosel_html(filename,descrip){
    var html = '<div class="carousel-cell">';
    html += '<img src= "static/thumbnails/' + filename + '"/>';
    html += '<p>' + descrip + '</p>';
    html += '</div>';
    return html;
}
function get_description_html(descrip){
    return '<p>' + descrip + '</p>';
}
function get_title_html(title){
    return '<p>' + descrip + '</p>';
}
function remove_all_carosel_entries(){
    var $carousel = $("#carouselholder");
    $carousel.flickity( 'remove', $carousel.flickity('getCellElements'));
}
function see_ip(db_id) {
    $.post(
        "/map/post",
        {db_id:db_id},
        function(data){
            var imgs = data.images;
            var ip_descrip = data.description;
            var ip_title = data.title;

            $('.popup').show();
            $('.popup-background').show();

            remove_all_carosel_entries();
            
            var carousel_html = "";
            imgs.forEach(function(img){
                var $cellElems = $(get_carosel_html(img.filename,img.description));
                $("#carouselholder").flickity('append', $cellElems);
            });
            $("#ip_description").html(ip_descrip);
            $("#ip_title").html(ip_title);


            // resize after un-hiding Flickity
            $("#carouselholder").flickity('resize');
            $("#carouselholder").flickity('reposition');
        });
      }
$(document).ready(function(){
    flkty = new Flickity(document.getElementById("carouselholder"),
        {imagesLoaded: true}
    );

    map = L.map('map').setView([lat_setting, long_setting], initial_zoom);
    
    L.tileLayer(tile_src, tile_attributes).addTo(map);

    // add pre-existing points, zones, and lines to map
    // interest_points, zones, and lines variables from the
    // interest_points.js file
    var point_features = L.geoJson(interest_points, {
      onEachFeature: onEachPoint
    }).addTo(map);

    var zone_features = L.geoJson(interest_zones, {
      onEachFeature: onEachZone
    }).addTo(map);

    var line_features = L.geoJson(interest_lines, {
      onEachFeature: onEachLine
    }).addTo(map);

    // Set layers and add toggle control menu for each layer
    var overlays = {
      "Interest Points": point_features,
      "Lines": line_features,
      "Zones": zone_features,
    }
    L.control.layers(null, overlays).addTo(map);


    // Use GPS to locate you on the map.

    map.locate({setView: false, maxZoom: 22});

    // Current solution to keep geoLocation only
    // relevant in the campus/canyon area is to set
    // map bounds. Not the ideal solution, but I think
    // it will work for now. 

    var northWest = L.latlng(45.48469, -122.63892);
    var southEast = L.latlng(45.47846, -122.62171);
    var bounds = L.latLngBounds(northWest, southEast);

    map.setMaxBounds(bounds);

    // Popup will change later.

    // Set up GPS location

    function onLocationFound(e) {
      var radius = e.accuracy / 2;

      L.marker(e.latlng).addTo(map)
        .bindPopup("You are within " + radius + " meters from this point").openPopup();

      L.circle(e.latlng, radius).addTo(map);

    }
    map.on('locationfound', onLocationFound);

    // Error if locating fails
    function onLocationError(e) {
      alert(e.message);
    }

    map.on('locationerror', onLocationError);

    // Set layers and add toggle control menu for each layer
    var overlays = {
      "Interest Points": point_features,
      "Lines": line_features,
      "Zones": zone_features,
    }
    L.control.layers(null, overlays).addTo(map);


    // Display the id of an interest point when clicked
    function whenClicked(e) {
     see_ip(e.target.feature.geometry.db_id);
    }

// Display latlng info for any place on the map when clicked
    function onMapClick(e) {
      L.popup()
        .setLatLng(e.latlng)
        .setContent(e.latlng.toString())
        .openOn(map);
}


// Trigger onMapClick function whenever map is clickeddb_id
map.on('click', onMapClick);


    set_map_click(map);
});
