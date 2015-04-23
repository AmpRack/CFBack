'use strict';

// The Auth service handles transmitting user data to and from Firebase
app.factory('Auth', function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope, $firebase, $location) {
	var ref = new Firebase(FIREBASE_URL);	// Access the firebase url
	var auth = $firebaseSimpleLogin(ref);	// Access the firebase login service
	var profileRef = $firebase(ref.child('profile'));
	var defaultAvatar = 'http://i.imgur.com/QGpIArR.jpg'; // Default user avatar

	var Auth = {
		register: function (user) {
			return auth.$createUser(user.email, user.password);
		},

		createProfile: function (user) {
			var profile = {
				username: user.username,										// User displayed name
				about: 'I\'m a student at Codify Academy!',	// User bio
				avatar: defaultAvatar,
				postCount: 0,																// Number of posts made
				replyCount: 0,															// Number of replies made
				link: 'http://www.codifyacademy.com',				// User personal link
				linkTitle: 'Codify Academy Homepage'				// Personal link description
			};
			console.log('Creating new user...');	
			return profileRef.$set(user.uid, profile);
		},
		
		login: function (user) {
			return auth.$login('password', user);
		},
		
		logout: function () {
			auth.$logout();
		},
		
		resolveUser: function() {
			return auth.$getCurrentUser();
		},
	  
	  signedIn: function() {
	   	return !!Auth.user.provider;
	  },
	  
	  updateProfile: function(uid, newInfo) {
	  	console.log('Updating profile...');
	  	return profileRef.$set(uid, newInfo);
	  },

	  resetPassword: function(email) {
	  	console.log('Requesting new password email...');
	  	return auth.$sendPasswordResetEmail(email);
	  },

	  changePassword: function(creds) {
	  	console.log('Changing password');
	  	return auth.$changePassword(creds.email, creds.oldPass, creds.newPass);
	  },
		
		user: {}
	};

	// When we're logged in, do this stuff
	$rootScope.$on('$firebaseSimpleLogin:login', function(e, user) {
	  angular.copy(user, Auth.user);
	  Auth.user.profile = $firebase(ref.child('profile').child(Auth.user.uid)).$asObject();
	  console.log('Logged in');
	});

	// ..and when we log out, do this stuff
	$rootScope.$on('$firebaseSimpleLogin:logout', function() {
		if(Auth.user && Auth.user.profile) {
	    	Auth.user.profile.$destroy();
	  	}
	  	angular.copy({}, Auth.user);
		console.log('Logged out, redirecting to login');
		$location.path('/');
		$('#nav-master').css('display','none');
	});

	return Auth;
});