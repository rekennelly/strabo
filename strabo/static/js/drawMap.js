var shapeLayer;

function init_map(){
    /*
    Creates and configures the admin map and adds the interest points to it.

    Returns the map.
    */
    var drawMap = make_map('drawMap');
    add_tile_to(drawMap);


    var all_layers_group = L.geoJson(features);
    set_styles(all_layers_group);
    bind_popups(all_layers_group);
    all_layers_group.addTo(drawMap);
    return drawMap;
}
$(function()
{
var drawMap = init_map();

var drawnItems = new L.FeatureGroup();
drawMap.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
// Removes some toolbar things and also sets colors

var shapeColorInit = '#2397EB';

var options1 = {

    draw : {
      polyline: {
        shapeOptions: {
          color: shapeColorInit
        }
      },
      polygon: {
        shapeOptions: {
          color: shapeColorInit
        }
      },
      circle: false,
      rectangle: false
    },


    edit: {
      featureGroup: drawnItems,
      edit: {
        selectedPathOptions: {
          color: 'red'
        }
      }
    }
}

var options2 = {
  draw: false,

  edit: {
      featureGroup: drawnItems,
      edit: {
        selectedPathOptions: {
          color: 'red'
        }
      }
    }
}

var drawControla = new L.Control.Draw(options1);
var drawControlb = new L.Control.Draw(options2);

drawMap.addControl(drawControla);

drawMap.on('draw:created', function (e) { //grab s layer of drawn item
    shapeLayer = e.layer;
    drawnItems.addLayer(shapeLayer);

    drawControla.removeFrom(drawMap);
    drawMap.addControl(drawControlb);
})

drawMap.on('draw:deleted', function (e) {
    //awkward, test this in different browsers
    if (Object.keys(e.layers._layers).length > 0){
        drawControlb.removeFrom(drawMap);
        drawMap.addControl(drawControla);
    }
})
$('#upload-btn').click(function (e) {
    var JSONobject = shapeLayer != null ? JSON.stringify(shapeLayer.toGeoJSON()) : "";
    $('#geojson-field').attr("value", JSONobject);
});
});
