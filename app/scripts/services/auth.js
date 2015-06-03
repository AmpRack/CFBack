'use strict';

// The Auth service handles transmitting user (login) data to and from Firebase
app.factory('Auth', function ($firebaseAuth, $firebaseObject, FIREBASE_URL, $rootScope, $location) {
	var ref = new Firebase(FIREBASE_URL);
	var auth = $firebaseAuth(ref);

	var Auth = {
		register: function (user) {
			return auth.$createUser(user);
		},

		login: function (user) {
			return auth.$authWithPassword(user);
		},
		
		logout: function () {
			auth.$unauth();
		},
		
		resolveUser: function() {
			return auth.$getAuth();
		},
	  
		signedIn: function() {
	   		return !!Auth.user.provider;
	  	},
	  
		resetPassword: function(email) {
			console.log('Requesting new password email...');
			return auth.$sendPasswordResetEmail(email);
		},

		changePassword: function(userCreds) {
			console.log('Changing password');
			return auth.$changePassword(userCreds);
		},
		
		user: {}
	};

	// When a user has logged in successfully
	auth.$onAuth(function(user) {
  		if (user) { 
  			$('#nav-master').css('display','block');
  			angular.copy(user, Auth.user);
	  		Auth.user.profile = $firebaseObject(ref.child('profile').child(user.uid));
    		console.log('Logged in.');

  	// If a user is logged out...
  		} else { 
  			if(Auth.user && Auth.user.profile) {
				Auth.user.profile.$destroy();
			}

		angular.copy({}, Auth.user);
			$('#nav-master').css('display','none');
			console.log('Redirecting to login');
			$location.path('/');
  		}
	});

	return Auth;
});