/* tursics.de/story/ - JavaScript file */

/*jslint browser: true*/
/*global $,L,window,document,ddj*/

// -----------------------------------------------------------------------------

function mapAction() {
	'use strict';
}

// -----------------------------------------------------------------------------

function updateMapSelectItem(data) {
	'use strict';

	mapAction();

	ddj.quickinfo.show(data);
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

var ControlInfo = L.Control.extend({
	options: {
		position: 'bottomright'
	},

	onAdd: function () {
		'use strict';

		var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');

		if ($('#popupShare').length === 1) {
			container.innerHTML = '<a style="font-size:1.2em" href="#popupShare" title="Teilen" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-share-alt" aria-hidden="true"></i></a>';
		}
		if ($('#popupInfo').length === 1) {
			container.innerHTML += '<a style="font-size:1.2em" href="#popupInfo" title="Info" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-info" aria-hidden="true"></i></a>';
		}
		if ($('#popupAuthor').length === 1) {
			container.innerHTML += '<a style="font-size:1.2em" href="#popupAuthor" title="Autor" data-rel="popup" data-position-to="window" data-transition="pop"><i class="fa fa-envelope" aria-hidden="true"></i></a>';
		}

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
//		attribution: 'icons made by <a href="https://www.flaticon.com/authors/eucalyp" title="Eucalyp">Eucalyp</a> from <a href="https://www.flaticon.com/" title="Flaticon">flaticon.com</a>',
		centerLat: 52.536686,
		centerLng: 13.604863,
		zoom: 14,
		onFocusOnce: mapAction
	});

	var dataUrlSanierungen = 'http://tursics.de/story/schule-marzahn-2020/data/spreadsheets.php?nocache=' + (new Date().getTime());

	$.getJSON(dataUrlSanierungen, function (dataSanierungen) {
		var data = dataSanierungen;

		ddj.init(data);
		ddj.setUniqueIdentifier('BSN');
	}).done(function() {
		ddj.marker.init({
			onAdd: function (marker) {
				marker.color = 'darkred';
//				marker.iconPrefix = 'fa';
//				marker.iconFace = 'fa-building-o';

				return true;
			},
			onClick: function (latlng, data) {
				updateMapSelectItem(data);
			}
		});

		ddj.search.init({
			orientation: 'auto',
			showNoSuggestion: true,
			titleNoSuggestion: '<i class="fa fa-info-circle" aria-hidden="true"></i> Geben sie bitte den Namen einer Schule ein',
			onAdd: function (obj, value) {
				var name = value.Schulname,
					color = 'darkred';

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
					icon = 'fa-dot-circle-o',
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

		ddj.quickinfo.init({
			onShow: function () {
				$('#infoSign').hide();
			},
			onHide: function () {
				$('#autocomplete').val('');
				$('#infoSign').show();
			}
		});

		$('.visibleWithoutData').hide();
		$('.visibleWithData').show();
	}).fail(function(jqXHR, textStatus) {
		$('.visibleWithoutErrors').hide();
		$('.visibleWithErrors').show();
	}).always(function() {
		ddj.getMap().addControl(new ControlInfo());

		$('#autocomplete').val('');

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
});

// -----------------------------------------------------------------------------
