function initializeHome () {

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
	
	var $btn = $('#home-submit').button('loading');

	$btn.on('click', function () {
		getBusinesses();
	});

	var lat, lng, crd, acc, term, radius, offset = 0;

	function initializeMap(lat, lng, acc, zoom) {
		var mapCanvas = document.getElementById('map_canvas');
		var mapOptions = {
			center: new google.maps.LatLng(lat, lng),
			zoom: zoom,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		var map = new google.maps.Map(mapCanvas, mapOptions);
		var marker = new google.maps.Marker({
			position: new google.maps.LatLng(lat, lng),
			title:"Your Location"
		});
		var circle = new google.maps.Circle({
			center: new google.maps.LatLng(lat, lng),
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35,
			radius: acc
		});

		marker.setMap(map);
		circle.setMap(map);
	}

	initializeMap(39.828127,-98.579404, null, 3);


	function codeAddress(address) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				initializeMap(results[0].geometry.location.k, results[0].geometry.location.B, null, 17);
				$btn.button('reset');
			} else {
				alert("Geocode was not successful for the following reason: " + status);
			}
		});
	}

	function locateByBrowser () {

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
			initializeMap(lat, lng, acc, 17);
		}

		function error(err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
			var address = prompt('Unable to determine your location. Please input your address:');
			codeAddress(address);
		}

		navigator.geolocation.getCurrentPosition(success, error, options);
	}

	locateByBrowser();


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

	initializeHome.getMoreBusinesses = getBusinesses;
	initializeHome.getLocation = getLocation;
}


