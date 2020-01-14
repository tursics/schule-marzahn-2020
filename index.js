/* tursics.de/story/ - JavaScript file */

/*jslint browser: true*/
/*global $,L,window,document,ddj*/

var layerPopup = null;

// -----------------------------------------------------------------------------

function mapAction() {
	'use strict';
}

// -----------------------------------------------------------------------------

function enrichMissingData(data) {
	'use strict';

	return data;
}

// -----------------------------------------------------------------------------

function getColor() {
	'use strict';

	return 'blue';
}
// -----------------------------------------------------------------------------

function updateMapSelectItem(data) {
	'use strict';

	mapAction();

	ddj.quickinfo.show(data);
}

// -----------------------------------------------------------------------------

function updateMapHoverItem(coordinates, data, icon, offsetY) {
	'use strict';

	var options = {
		closeButton: false,
		offset: L.point(0, offsetY),
		className: 'printerLabel teacher' + Math.floor(Math.random() * 0)
	},
		str = '';

	str += '<div class="top">' + data.Schulname + '</div>';
	str += '<div class="middle">' + data.Summe + '</div>';
	str += '<div class="bottom">Baubeginn ' + data.Baubeginn + '</div>';

	layerPopup = L.popup(options)
		.setLatLng(coordinates)
		.setContent(str)
		.openOn(ddj.getMap());
}

// -----------------------------------------------------------------------------

function updateMapVoidItem() {
	'use strict';

	if (layerPopup && ddj.getMap()) {
		ddj.getMap().closePopup(layerPopup);
		layerPopup = null;
    }
}

// -----------------------------------------------------------------------------

function selectSuggestion(selection) {
	'use strict';

	var done = false;
	$.each(ddj.getData(), function (key, val) {
		if (!done && val && (val.BSN === selection)) {
			done = true;
			ddj.getMap().panTo(new L.LatLng(val.lat, val.lng));
			updateMapSelectItem(ddj.getAllObjects(val));
		}
	});
}

// -----------------------------------------------------------------------------
/*
function initSocialMedia() {
	'use strict';

	setTimeout(function () {
		$.ajax('http://www.tursics.de/v5shariff.php?url=http://schulsanierung.tursics.de/')
			.done(function (json) {
				$('.social .facebook span').html(json.facebook);
				if (json.facebook > 0) {
					$('.social .facebook span').addClass('active');
				}

				$('.social .twitter span').html(json.twitter);
				if (json.twitter > 0) {
					$('.social .twitter span').addClass('active');
				}
			});
	}, 1000);
}
*/
// -----------------------------------------------------------------------------

var ControlInfo = L.Control.extend({
	options: {
		position: 'bottomright'
	},

	onAdd: function () {
		'use strict';

		var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

		container.innerHTML = '<a style="font-size:1.2em" href="#popupShare" title="Teilen" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-share-alt" aria-hidden="true"></i></a>';
		container.innerHTML += '<a style="font-size:1.2em" href="#popupInfo" title="Info" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-info" aria-hidden="true"></i></a>';
		container.innerHTML += '<a style="font-size:1.2em" href="#popupAuthor" title="Autor" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-envelope" aria-hidden="true"></i></a>';

		return container;
	}
});

// -----------------------------------------------------------------------------

$(document).on("pageshow", "#pageMap", function () {
	'use strict';

	function updateEmbedURI() {
		var size = $('#selectEmbedSize').val().split('x'),
			x = size[0],
			y = size[1],
			html = '<iframe src="https://tursics.github.io/schule-marzahn-2020/" width="' + x + '" height="' + y + '" frameborder="0" style="border:0" allowfullscreen></iframe>';

		$('#inputEmbedURI').val(html);
		if (-1 === $('#embedMap iframe')[0].outerHTML.indexOf('width="' + x + '"')) {
			$('#embedMap iframe')[0].outerHTML = html.replace('.html"', '.html?foo=' + (new Date().getTime()) + '"');
			$('#embedMap input').focus().select();
		}
	}

	// center the city hall of Marzahn-Hellerdorf
	ddj.map.init('mapContainer', {
		mapboxId: 'tursics.l7ad5ee8',
		mapboxToken: 'pk.eyJ1IjoidHVyc2ljcyIsImEiOiI1UWlEY3RNIn0.U9sg8F_23xWXLn4QdfZeqg',
		centerLat: 52.536686,
		centerLng: 13.604863,
		zoom: 14,
		onFocusOnce: mapAction
	});

	var basePath = 'https://raw.githubusercontent.com/tursics/schule-marzahn-2020/master/', // 'https://raw.githubusercontent.com/tursics/schule-marzahn-2020/master/',
		dataUrlSanierungen = basePath + 'data/marzahn-2020.json';

//	dataUrlSanierungen = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-b0umnLD64PxS-rbJ3iJIndwJbnDri6pSt72YQSfWVQQHlNdlNy5Hi9a2mIqTXmPOMZLxB3JFXkJt/pubhtml';
//	dataUrlSanierungen = 'https://spreadsheets.google.com/feeds/list/2PACX-1vQ-b0umnLD64PxS-rbJ3iJIndwJbnDri6pSt72YQSfWVQQHlNdlNy5Hi9a2mIqTXmPOMZLxB3JFXkJt/od6/public/basic?alt=json';
//	dataUrlSanierungen = 'https://spreadsheets.google.com/feeds/cells/rbJ3iJIndwJbnDri6pSt72YQSfWVQQHlNdlNy5Hi9a2mIqTXmPOMZLxB3JFXkJt/od6/public/basic?alt=json';
/*	var dataUrlSanierungen2 = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQ-b0umnLD64PxS-rbJ3iJIndwJbnDri6pSt72YQSfWVQQHlNdlNy5Hi9a2mIqTXmPOMZLxB3JFXkJt/pub?gid=1577405458&single=true&output=csv';

	$.ajax({
		url: dataUrlSanierungen2,
		type: 'GET',
		xhrFields: {
			withCredentials: true
		},
		success: function (response) {
			console.log(response);
		},
		error: function (xhr, status) {
			console.error(status);
		}
	});*/
	
	$.getJSON(dataUrlSanierungen, function (dataSanierungen) {
		var data = dataSanierungen;
		data = enrichMissingData(data);

		ddj.init(data);
		ddj.setUniqueIdentifier('BSN');

		ddj.marker.init({
			onAdd: function (marker, value) {
//				marker.color = getColor(value);
//				marker.iconPrefix = 'fa';
//				marker.iconFace = 'fa-building-o';

				if (marker.count > 1) {
					marker.iconFace = 'fa-building-o';
				}

				return true;
			},
			onMouseOver: function (latlng, data) {
				updateMapHoverItem(latlng, data, {
					options: {}
				}, 6);
			},
			onMouseOut: function (latlng, data) {
				updateMapVoidItem(data);
			},
			onClick: function (latlng, data) {
				updateMapSelectItem(data);
			}
		});

		ddj.search.init({
			showNoSuggestion: true,
			titleNoSuggestion: '<i class="fa fa-info-circle" aria-hidden="true"></i> Geben sie bitte den Namen einer Schule ein',
			onAdd: function (obj, value) {
				var name = value.Schulname,
					color = getColor(value);

				if ('' !== value.BSN) {
					name += ' (' + value.BSN + ')';
				}

				obj.sortValue1 = name;
				obj.sortValue2 = value.BSN;
				obj.data = value.BSN;
				obj.color = color;
				obj.value = name;
				obj.desc = value.Schulart;

				return true;
			},
			onFocus: function () {
				mapAction();

				window.scrollTo(0, 0);
				document.body.scrollTop = 0;
				$('#pageMap').animate({
					scrollTop: parseInt(0, 10)
				}, 500);
			},
			onFormat: function (suggestion, currentValue) {
				var color = suggestion.color,
					icon = 'fa-building-o',
					str = '';

				str += '<div class="autocomplete-icon back' + color + '"><i class="fa ' + icon + '" aria-hidden="true"></i></div>';
				str += '<div>' + suggestion.value.replace(new RegExp(currentValue.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"), 'gi'), '<strong>' + currentValue + '</strong>') + '</div>';
				str += '<div class="' + color + '">' + suggestion.desc + '</div>';
				return str;
			},
			onClick: function (data) {
				if (Array.isArray(data)) {
					selectSuggestion(data[0].BSN);
				} else {
					selectSuggestion(data.BSN);
				}
			}
		});

		ddj.quickinfo.init();

//		initSocialMedia();
	});

	ddj.getMap().addControl(new ControlInfo());

	$('#autocomplete').val('');
	$('#searchBox .sample a:nth-child(1)').on('click', function () {
		$('#autocomplete').val('32. Schule (Grundschule) (11G32)');
		selectSuggestion('11G32');
	});
	$('#searchBox .sample a:nth-child(2)').on('click', function () {
		$('#autocomplete').val('Staatliche Ballettschule Berlin und Schule für Artistik (03B08)');
		selectSuggestion('03B08');
	});

	$("#popupShare").on('popupafteropen', function () {
		$('#shareLink input').focus().select();
	});
	$('#tabShareLink').on('click', function () {
		$('#popupShare').popup('reposition', 'positionTo: window');
		$('#shareLink input').focus().select();
	});
	$('#tabEmbedMap').on('click', function () {
		updateEmbedURI();
		$('#popupShare').popup('reposition', 'positionTo: window');
		$('#embedMap input').focus().select();
	});

	$('#selectEmbedSize').val('400x300').selectmenu('refresh');
	$('#selectEmbedSize').on('change', function () {
		updateEmbedURI();
		$('#popupShare').popup('reposition', 'positionTo: window');
	});
});

// -----------------------------------------------------------------------------
