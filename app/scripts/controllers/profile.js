'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, Auth, Post, userPosts) {
	$scope.user = Auth.user;
	var uid = $routeParams.userId;
	var thisPostId = '';
	
	$scope.posts = userPosts;
  	$scope.userPostCount = $scope.posts.length;

  	$scope.editProfile = function() {
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
  		console.log('Updating profile...');
  		return Auth.updateProfile(uid, template);
  	};

  	$scope.deletePost = function(postId) {
  		console.log('Deleting post...');
  		Post.deletePost(postId);
  		Post.deleteReply(postId);
  		$route.reload();
  	};

  	// Broadcasts the postId to the scope, so replies match up to posts,
  	// Then retrieve posts and replies
  	$scope.getPostId = function(post) {
    	thisPostId = post.$id;
    	$scope.viewPost = Post.getPost(post.$id);
    	$scope.replies = Post.getReplies(post.$id);
  	};

  	$scope.addReply = function() {
	    var thisTime = timeStamp();
	    $scope.reply.postTime = thisTime[0];
	    $scope.reply.postDate = thisTime[1];
	    $scope.reply.creator = $scope.user.profile.username;
	    $scope.reply.creatorUID = $scope.user.uid;
	    $scope.reply.creatorAvatar = $scope.user.profile.avatar;
	    $scope.reply.parentId = thisPostId;
	    $scope.reply.authorSeen = false;
	    
	    console.log('Adding reply...');
	    $('#viewPostModal').modal('hide');
	    Post.addReply($scope.reply, thisPostId).then(function() {
      		$scope.reply = {content: ''};
      		thisPostId = '';
      		$scope.viewPost = {};
      		$route.reload();
      	});
  	};

	$scope.logout = Auth.logout;
});	