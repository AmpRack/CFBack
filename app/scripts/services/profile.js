'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function (FIREBASE_URL, $firebase, imgur) {
	var ref = new Firebase(FIREBASE_URL);

	var Profile = {
		get: function (userId) { // Load the user profile
			return $firebase(ref.child('profile').child(userId)).$asObject();
		},

		userPosts: function(userId) { // Retrieve your own posts
			return $firebase(ref.child('posts')).$asArray().$loaded().then(function(posts){
			var output = [];
			for (var i = 0; i < posts.length; i++) {
        if (posts[i].creatorUID === userId) {
          output.push(posts[i]);
        	}
      	}
      return output;
			});
		}
	};

	return Profile;
});