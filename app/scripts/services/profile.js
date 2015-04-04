'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function (FIREBASE_URL, $firebase) {
	var ref = new Firebase(FIREBASE_URL);

	var Profile = {
		get: function (userId) { // Load the user profile
			return $firebase(ref.child('profile').child(userId)).$asObject();
		},

		userPosts: function(userId) { // Retrieve 
			return $firebase(ref.child('posts')).$asArray().$loaded().then(function(posts){
			var output = new Array();
			for (var i = 0; i < posts.length; i++) {
        		if (posts[i].creatorUID === userId) {
          			output.push(posts[i]);
        		}
      		}
      		return output;
			});
		},
		incPost: function() { // Increment post counter, not ready yet!
			/*var userRef = profile.get(userId);
			console.log(userRef.postCount);
			console.log(userRef);
			var postCount = userRef.postCount;
			postCount++;
			return $firebase(ref.child('profile').child(userId))$set(postCount, postCount);*/
		}
	};

	return Profile;
});