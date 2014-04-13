var map = L.map('map').setView([51.474104, -0.093027], 15),
	mapURL = 'http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.jpg',
	// mapURL = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
	xhr = new XMLHttpRequest(),
	mapIcon = L.Icon.extend({
		options : {
			iconSize : [32,37],
			iconAnchor: [16,34],
			popupAnchor: [0,-35]
		}
	}),
	iconsPath = 'icons/',
	cinemaLayer = [],
	leisureLayer = [],
	pubLayer = [],
	transportLayer = [];

L.tileLayer(mapURL, {
	attribution : '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
	subdomains : ['otile1','otile2','otile3','otile4'],
	detectRetina : true
}).addTo(map);

function addMarkers (result) {
	var thisResult,
		thisLayer,
		layerName;

	for (var i in result.places) {
		thisResult = result.places[i];
		switch (thisResult.type) {
			case 'cinema' :
				thisLayer = cinemaLayer;
				break;
			case 'leisure' :
				thisLayer = leisureLayer;
				break;
			case 'pub' :
				thisLayer = pubLayer;
				break;
			case 'transport' :
				thisLayer = transportLayer;
				break;
		}
		icon = new mapIcon({ iconUrl : iconsPath + thisResult.icon }),
		layerName = L.marker(
			[thisResult.location.lat,thisResult.location.lon],
			{ icon: icon }
			).bindPopup('<h2>'+thisResult.name+'</h2>');
		thisLayer.push(layerName);
	}

	var cinemaOverlay = L.layerGroup(cinemaLayer).addTo(map),
		leisureOverlay = L.layerGroup(leisureLayer).addTo(map),
		pubOverlay = L.layerGroup(pubLayer).addTo(map),
		transportOverlay = L.layerGroup(transportLayer).addTo(map),
		overlayMap = {
		'Cinema' : cinemaOverlay,
		'Leisure' : leisureOverlay,
		'Pubs' : pubOverlay,
		'Transport' : transportOverlay
	};
	L.control.layers(null,overlayMap).addTo(map);
}

xhr.open('GET','places.json',true);
xhr.addEventListener('load', function() {
	addMarkers(JSON.parse(xhr.responseText));
});
xhr.send();