'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function (Post, $rootScope, $firebaseObject, $firebaseArray, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var profileRef = ref.child('profile');

	var Profile = {
		// Create a new user profile object
		create: function (user) {
			var userId = user.uid;
			var newProfile = {
				about: 'I\'m a student at Codify Academy!',
				avatar: 'http://i.imgur.com/QGpIArR.jpg',
				postCount: 0,
				link: 'http://www.codifyacademy.com/',
				linkTitle: 'Codify Academy Homepage',
				uid: user.uid,
				username: user.username
			};
			console.log('New user ' + user.username + ' created!');	
			return profileRef.child(userId).set(newProfile);
		},

		// Load the user profile
		get: function (userId) {
			return $firebaseObject(profileRef.child(userId));
		},

		// Update profile after user editing
		update: function(userId, newInfo) { 
			console.log('Profile updated.');
			return profileRef.child(userId).update(newInfo);
		},

		// Update a user's profile picture
		setAvatar: function(userId, imageLink) { 
			console.log('Avatar updated.');
			return profileRef.child(userId).child('avatar').set(imageLink);
		},

		// Retrieve your own posts
		userPosts: function(userId) { 
			return $firebaseArray(ref.child('posts')).$loaded().then(function(posts){
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