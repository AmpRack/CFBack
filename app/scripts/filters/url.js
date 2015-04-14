'use strict';

// Given some link, return only the domain name
app.filter('hostnameFromUrl', function() {
	return function(str) {
		var url = document.createElement('a');

		url.href = str;

		return url.hostname;
	};
});