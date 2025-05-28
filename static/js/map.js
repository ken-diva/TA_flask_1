const map = new maplibregl.Map({
	container: "map",
	style: "https://demotiles.maplibre.org/style.json",
	center: [107.63, -6.974],
	zoom: 17,
	pitch: 60,
	bearing: -20,
	antialias: true,
});

map.addControl(new maplibregl.NavigationControl());

fetch("/api/buildings")
	.then((res) => res.json())
	.then((buildings) => {
		buildings.forEach((b) => {
			const marker = new maplibregl.Marker()
				.setLngLat([b.lng, b.lat])
				.setPopup(
					new maplibregl.Popup().setHTML(`
                    <h3>${b.name}</h3>
                    <p>${b.description}</p>
                `)
				)
				.addTo(map);
		});
	});
