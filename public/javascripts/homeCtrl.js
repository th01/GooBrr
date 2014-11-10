function homeMap () {

	var lat, lng, crd, acc, term, radius, offset = 0;

	$('.term').on('click', function () {
		$('.term, #term-dropdown').removeClass("active");

		if ($(this).val()) {
			$(this).addClass("active");
			term = $(this).val();
		} else {
			term = $(this).data("value");
			$('#term-dropdown').addClass('active');
			$('#term-dropdown').html( $(this).text() + ' <span class="caret"></span>');
		}
	});

	$('.radius').on('click', function () {
		radius = $(this).val();
		$(this).addClass("active").siblings().removeClass("active");
	});

	function initializeMap(lat, lng) {
		var mapCanvas = document.getElementById('map_canvas');
		var mapOptions = {
			center: new google.maps.LatLng(lat, lng),
			zoom: 18,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(mapCanvas, mapOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			title:"Your Location"
		});
		marker.setMap(map);
	}

	google.maps.event.addDomListener(window, 'load', initializeMap);

	var $btn = $('#home-submit').button('loading');
	var options = {
		enableHighAccuracy: true,
		timeout: 10000,
		maximumAge: 0
	};

	function success(pos) {
		crd = pos.coords;
		lat = (crd.latitude).toFixed(5);
		lng = (crd.longitude).toFixed(5);
		acc = crd.accuracy;
		$btn.button('reset');
		initializeMap(lat, lng);
	}

	function error(err) {
		alert('error loading GPS coordinates, please refresh page');
		console.warn('ERROR(' + err.code + '): ' + err.message);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);

	$('#home-submit').on('click', function () {
		getBusinesses();
	});

	function getBusinesses (callback) {
		var params = {
			term: term,
			radius: radius,
			lat: lat,
			lng: lng,
			offset: offset 
		};

		$.ajax({
			url: '/',
			type: 'POST',
			data: params,
			success: function(data, textStatus, jqXHR)
			{
				businessesArr = data;
				offset += 20;
				window.location = '#/selection';
				
				if (callback) {
					callback();
				}
			},
			error: function (jqXHR, textStatus, errorThrown) 
			{
				console.log(errorThrown);
			}
		});
	}

	function getLocation () {
		return [lat,lng];
	}

	homeMap.getBusinesses = getBusinesses;
	homeMap.getLocation = getLocation;
}


