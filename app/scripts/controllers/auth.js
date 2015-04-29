'use strict';

app.controller('AuthCtrl', function ($scope, $location, Auth, user, Profile) {
	// If we're loggedin, just go to the main page
	if (user) {
		$location.path('/main');
	}

	// Send user login info to firebase for verification
	$scope.login = function() {
		Auth.login($scope.user).then(function (){
			$location.path('/main');
		}, function (error) {
			$scope.error = error.toString();
		});
	};

	// For new registration, send info to firebase for verification and account creation
	$scope.register = function() {
		Auth.register($scope.user).then(function(user) {
			return Auth.login($scope.user).then(function(){ 
				user.username = $scope.user.username;
				return Profile.create(user);
			}).then(function(){
				$location.path('/main');
			});
		}, function(error) {
			$scope.error = error.toString();
		});
	};

	// Password reset
	$scope.resetPass = function() {
		Auth.resetPassword($scope.userEmail);
	};
});