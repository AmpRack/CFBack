'use strict';

app.controller('ProfileCtrl', function ($scope, $routeParams, $location, Post, Profile, Auth) {
	var uid = $routeParams.userId;
	$scope.profile = Profile.get(uid);
	$scope.posts = Post.getPostsBy('creatorUID', uid);
	$scope.user = Auth.user;
	$scope.profile.uid = uid;
  	$scope.userPostCount = $scope.posts.length;
  	$scope.user.profile.postCount += 1;

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

	$scope.logout = Auth.logout;
});