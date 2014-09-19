$(document).ready(function() {
	var index = function() {
		var jst = JST['index']({index: 'This text is interpolated'});
		$('.starter-template').append(jst);
	};
	index();
});