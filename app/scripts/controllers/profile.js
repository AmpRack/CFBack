'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, Profile, Post, Auth) {
	var uid = $routeParams.userId;
	console.log(uid);

	$scope.user = Auth.user;
	$scope.profile = Profile.get(uid);


	Post.getPostsBy('creatorUID', uid).then(function(posts){
		console.log(posts);
		$scope.posts = posts;
	});

	// Use this to order posts newest to oldest
	$scope.reverse = function(array) {
  		var copy = [].concat(array);
    	return copy.reverse();
  	};
});