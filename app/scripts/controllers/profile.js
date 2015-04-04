'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, $location, Auth, Post, Profile, userPosts) {
	$scope.user = Auth.user;
	var uid = $routeParams.userId;
	
	$scope.profile = Profile.get(uid);
	$scope.profile.uid = uid;
	$scope.posts = userPosts;
  	$scope.userPostCount = $scope.posts.length;

  	$scope.editProfile = function() {
  		console.log('Is this thing on?');
		var template = {
			username: $scope.profile.username,
			about: $scope.profile.about,
			avatar: $scope.profile.avatar,
			postCount: $scope.profile.postCount,
			replyCount: $scope.profile.replyCount,
			link: $scope.profile.link,
			linkTitle: $scope.profile.linkTitle
		};

  		return Auth.updateProfile(uid, template);
  	};

  	$scope.deletePost = function(thisPost) {
  		console.log(thisPost);
  		Post.delete(thisPost);
  		$route.reload();
  	};

	$scope.logout = Auth.logout;
});