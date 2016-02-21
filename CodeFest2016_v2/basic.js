// JavaScript source code
//LOAD Councilmen
var councildata_src = "data/council.json";
var councildata;

$.getJSON(councildata_src, function (data) {
    councildata = data;
});


//------[MapBox®]------
//Carlos Alvarez MapBox API KEY
L.mapbox.accessToken = 'pk.eyJ1Ijoia3lsaW1hbmhhcm8iLCJhIjoic1VtaVk1VSJ9.XhSycFXpnjkaUGikAsdJxw';
//39° 57′ 0″ N, 75° 10′ 0″ W
var coordinates = [39.95, -75.166667];

var currentRegion;
//LOAD MapBox Map
function loadMap() {

    var map = L.mapbox.map('map', 'mapbox.streets')
        .setView(coordinates, 12);

    //CREATE geocoder/search control
    var geocoderControl = L.mapbox.geocoderControl('mapbox.places', { autocomplete: true, });
    geocoderControl.addTo(map);
    var resultLayer = L.mapbox.featureLayer();
    resultLayer.addTo(map);
    geocoderControl.on('select', function (res) {
        resultLayer.setGeoJSON(res.feature);
    });

    //REGION LAYER
    //WARNING! currentRegion name may be misleading
    currentRegion = L.mapbox.featureLayer().addTo(map);


    //LOAD geoJSON
    //var currentLayer = "geo/US_Congressional_2012.geojson";
    var currentLayer = "geo/Council_Districts_2016.geojson";
    $.getJSON(currentLayer, function (data) {
        //LOAD GEOJSON TO LAYER
        currentRegion.setGeoJSON(data);
        //map.featureLayer.setGeoJSON(data);
        pdm_addFeatureEvents();
    });

    function pdm_addFeatureEvents() {
        //Stuff for each region/feature of the layer
        currentRegion.eachLayer(function (focusRegion) {
            var prop = focusRegion.feature.properties;
            var district = prop.DISTRICT;
            var districtData = councildata.district[district - 1];
            //popup markup
            var popup = "<h1> District " + district + "</h1>";
            popup += "<div style=\"innerdiv\" >";
            popup += "<p><strong>" + districtData.councilman + " (" + districtData.affiliation + ")</strong></p>";
            popup += "<p>" + districtData.location + "</p>";
            popup += "<p>" + districtData.phone + "</p>";
            popup += "</div>";

            //EVENTS
            focusRegion.on('click', function () {
                //[DEBUG]
                //alert("District " + district);
                focusRegion.openPopup();
            });

            focusRegion.bindPopup(popup);
        });
    }
}