'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Profile, Auth) {
	var uid = $routeParams.userId;

	$scope.profile = Profile.get(uid);
	$scope.user = Auth.user;

	// BRIEFLY! Use Auth.user to grab the basic user info,
	// then use that to grab ONLY that user's posts. Maybe compare it against
	// post.creator, and some iteration? 
	console.log($scope.user);
	console.log('test');
	Profile.getPosts(uid).then(function(posts) {
		$scope.posts = posts;
	});

	// Use this to order posts newest to oldest
	$scope.reverse = function(array) {
  		var copy = [].concat(array);
    	return copy.reverse();
  	};
});