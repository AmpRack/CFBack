'use strict';

// Controls user-specific functions and objects
app.factory('Profile', function (FIREBASE_URL, $firebase) {
	var ref = new Firebase(FIREBASE_URL);
	var profileRef = $firebase(ref.child('profile'));
	var replyRef = $firebase(ref.child('replies'));

	var Profile = {
		// Create a new user profile object
		create: function (user) {
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

		// Load the user profile
		get: function (userId) {
			return $firebase(ref.child('profile').child(userId)).$asObject();
		},

		// Update profile after user editing
		update: function(uid, newInfo) { 
			return profileRef.$set(uid, newInfo).then(function(){
				console.log('Profile updated.');
			});
		},

		// Update a user's profile picture
		setAvatar: function(uid, imageLink) { 
			return $firebase(ref.child('profile').child(uid)).$asObject().$loaded().then(function(thisUser) {
				thisUser.avatar = imageLink;
				return thisUser.$save().then(function(){
					console.log('Avatar updated.');
				});
			});
		},

		// Retrieve your own posts
		userPosts: function(userId) { 
			return $firebase(ref.child('posts')).$asArray().$loaded().then(function(posts){
			var output = [];
			for (var i = 0; i < posts.length; i++) {
        if (posts[i].creatorUID === userId) {
          output.push(posts[i]);
        	}
      	}
      return output;
			});
		},

		checkReplies: function(userId) {
			return Profile.userPosts(userId).then(function(posts){
				var output = [];
				for (var i = 0; i < posts.length; i++) {
					if (!posts[i].authorSeen) {
						output.push(posts[i]);
						// Pick up here!
					}
				}
			});
		}
	};

	return Profile;
});