# tursics.ddj.marker.js

version 0.1

## description

to be done

it's required to include leaflet
```
	<script src="lib/leaflet-0.7.7/leaflet.js"></script>
```

include in HTML header
```
	<script src="lib/tursics.ddj.js"></script>
	<script src="lib/tursics.ddj.map.js"></script>
	<script src="lib/tursics.ddj.marker.js"></script>
```


call in your JavaScript file
```
	ddj.init(data);
	ddj.marker.init({
			onAdd: function (marker, value) {
				return true;
			},
			onMouseOver: function (latlng, data) {
				// to somethink
			},
			onMouseOut: function (latlng, data) {
				// to somethink
			},
			onClick: function (latlng, data) {
				// to somethink
			}
		});
```
