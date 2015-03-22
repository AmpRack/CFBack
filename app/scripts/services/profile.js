'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function ($window, FIREBASE_URL, $firebase, Post, $q) {
	var ref = new $window.Firebase(FIREBASE_URL);
	var profile = {
		get: function (userId) {
			return $firebase(ref.child('profile').child(userId)).$asObject();
		}
	};

	return profile;
});