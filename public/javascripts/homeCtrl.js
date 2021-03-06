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

	var lat, lng, crd, acc, term, radius;

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

	//set default view to center of USA at zoom of 3 with no radius
	initializeMap(39.828127,-98.579404, null, 3);


	function codeAddress(address) {
		var geocoder = new google.maps.Geocoder();
		geocoder.geocode( { 'address': address}, function(results, status) {
			lat = results[0].geometry.location.k;
			lng = results[0].geometry.location.B;
			if (status == google.maps.GeocoderStatus.OK) {
				initializeMap(lat, lng, null, 17);
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
			zoom = acc < 50 ? 17 : Math.round( 20 - Math.log(acc/5)/Math.log(10)*3);
			$btn.button('reset');
			initializeMap(lat, lng, acc, zoom);
		}

		function error(err) {
			console.warn('ERROR(' + err.code + '): ' + err.message);
			var address = prompt('Unable to determine your location. Please input your address:');
			codeAddress(address);
		}

		navigator.geolocation.getCurrentPosition(success, error, options);
	}

	locateByBrowser();


	function getBusinesses (callback, offset) {
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
				window.location = '#/selection';
				callback(data);
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


