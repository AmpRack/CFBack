'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function (FIREBASE_URL, $firebase, Auth) {
	var ref = new Firebase(FIREBASE_URL);
	var profile = {
		get: function (userId) {
			return $firebase(ref.child('profile').child(userId)).$asObject();
		},
		incPost: function(userId) { // Increment post counter, not ready yet!
			/*var userRef = profile.get(userId);
			console.log(userRef.postCount);
			console.log(userRef);
			var postCount = userRef.postCount;
			postCount++;
			return $firebase(ref.child('profile').child(userId))$set(postCount, postCount);*/
		}
	};

	return profile;
});