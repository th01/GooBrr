$(document).on('ready', function () {
	var yesStr = "";

	$('.btn').on('click', function () {
		$(this).parent().parent().parent().remove();
	});

	$('.yes').on('click', function () {
		yesStr += $(this).val();
	});

	$('#results').on('click', function () {
		window.location.href = "/results/" + yesStr;
	});
});