'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, Auth, Post, userPosts) {
	$scope.user = Auth.user;
	var uid = $routeParams.userId;
	var newAvatar = $('#newAvatar');
	
	$scope.posts = userPosts;
  	$scope.userPostCount = $scope.posts.length;

  	$scope.editProfile = function() {
  		var newAvatar = $('#newAvatar');
  		// Upload to imgur, get return, then feed to template
		var template = {
			username: $scope.user.profile.username,
			about: $scope.user.profile.about,
			avatar: $scope.user.profile.avatar,
			postCount: $scope.userPostCount,
			replyCount: $scope.user.profile.replyCount,
			link: $scope.user.profile.link,
			linkTitle: $scope.user.profile.linkTitle
		};

  		$('#editProfileModal').modal('hide');
  		return Auth.updateProfile(uid, template);
  	};

  	$scope.deletePost = function(postId) {
  		console.log(postId);
  		Post.delete(postId);
  		$route.reload();
  	};

	$scope.logout = Auth.logout;
});