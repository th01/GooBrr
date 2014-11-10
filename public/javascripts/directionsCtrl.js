function directionsMap () {

	var directionsDisplay;
	var directionsService = new google.maps.DirectionsService();
	var map;
	var selectedMode = 'DRIVING';

	$('.trave-mode').on('click', function () {
		$('.trave-mode').removeClass("active");
		$(this).addClass("active");
		selectedMode = $(this).val();
		initialize();
	});

	function initialize() {
		directionsDisplay = new google.maps.DirectionsRenderer();
		map = new google.maps.Map(document.getElementById('directions-map'));
		directionsDisplay.setMap(map);
		var start = homeMap.getLocation().join(',');
		var end = selectedBusiness.latLng.join(',');
		var request = {
			origin: start,
			destination: end,
			travelMode: google.maps.TravelMode[selectedMode]
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			}
		});
	}

	initialize();

}