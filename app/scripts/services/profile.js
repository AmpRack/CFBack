'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function (FIREBASE_URL, $firebase) {
	var ref = new Firebase(FIREBASE_URL);
	var profileRef = $firebase(ref.child('profile'));

	var Profile = {
		create: function (user) { // Create a new user profile
			var profile = {
				username: user.username,										// User displayed name
				about: 'I\'m a student at Codify Academy!',	// User bio
				avatar: 'http://i.imgur.com/QGpIArR.jpg',
				postCount: 0,																// Number of posts made
				replyCount: 0,															// Number of replies made
				link: 'http://www.codifyacademy.com/',			// User personal link
				linkTitle: 'Codify Academy Homepage'				// Personal link description
			};
			return profileRef.$set(user.uid, profile).then(function(){
				console.log('New user ' + user.username + ' created!');	
			});
		},

		get: function (userId) { // Load the user profile
			return $firebase(ref.child('profile').child(userId)).$asObject();
		},

		update: function(uid, newInfo) { // Update profile after user editing
			return profileRef.$set(uid, newInfo).then(function(){
				console.log('Profile updated.');
			});
		},

		setAvatar: function(uid, imageLink) { // Update a user's profile picture
			return $firebase(ref.child('profile').child(uid)).$asObject().$loaded().then(function(thisUser) {
				thisUser.avatar = imageLink;
				return thisUser.$save().then(function(){
					console.log('Avatar updated.');
				});
			});
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