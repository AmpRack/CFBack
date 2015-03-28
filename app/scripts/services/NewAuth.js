'use strict';

// The Auth service handles transmitting user data to and from Firebase
app.factory('Auth', function (FIREBASE_URL, $rootScope, $location) {
	// $fb is the object that refers to the firebase/userdb/
	var $userdb = new Firebase(FIREBASE_URL).child('userdb');

	var Auth = {
		register: function(user) {
			var template = {
				about: 'I\'m a student at Codify Academy!',	// User bio
				avatar: 'http://i.imgur.com/QGpIArR.jpg', 	// Default image
				countPosts: 0,								// Number of posts made
				countReplies: 0,							// Number of replies made
				email: user.email,							// Duh
				link: 'http://www.codifyacademy.com',		// User personal link
				linkTitle: 'Codify Academy Homepage',		// Personal link description
				md5: $.md5(user.email),						// Hashed email for ID#
				username: user.username						// User displayed name
			};
			return $userdb.createUser(user.email, user.password).then(function(user){
				return $userdb.set(user.md5, template);
			});
		},
		login: function(user) {
			return $userdb.authWithPassword(user).then(function(user) {
				angular.copy(user, Auth.user);
				console.log('Logged in');
			});
		},
		logout: function() {
			$userdb.unauth().then(function() {
				angular.copy({}, Auth.user);
				console.log('Logged out, redirecting to login');
				$location.path('/');
				$('#nav-master').css('display','none');
			});
		},
		resolveUser: function() {
			return $userdb.getCurrentUser();
		},
	    signedIn: function() {
	      	return !!Auth.user.provider;
	    },
		updateProfile: function(user) {
			return $userdb.child(user.md5).update(user);
		},
		user: {} 
	};
	return Auth;
});

/* Alternate Take!

'use strict';

// The Auth service handles transmitting user data to and from Firebase
app.factory('Auth', function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope, $firebase, $location) {
	var ref = new Firebase(FIREBASE_URL);	// Access the firebase url
	var auth = $firebaseSimpleLogin(ref);	// Access the firebase login service

	var Auth = {
		register: function (user) {
			return auth.$createUser(user.email, user.password);
		},
		createProfile: function (user) {
			var profile = {
				username: user.username,					// User displayed name
				md5_hash: user.md5_hash,					// Hashed email for ID#
				email: user.email,							// Duh
				about: 'I\'m a student at Codify Academy!',	// User bio
				avatar: 'http://i.imgur.com/QGpIArR.jpg', 	// Default image
				countPosts: 0,								// Number of posts made
				countReplies: 0,							// Number of replies made
				link: 'http://www.codifyacademy.com',		// User personal link
				linkTitle: 'Codify Academy Homepage'		// Personal link description
			};			
			var profileRef = $firebase(ref.child('userdb'));
			return profileRef.$set(user.md5_hash, profile);
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

*/