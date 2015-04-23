'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, Auth, Post, userPosts, imgur) {
	$scope.user = Auth.user;
	var uid = $routeParams.userId;
	var thisPostId = '';
	$scope.posts = userPosts;

  	$scope.editProfile = function() {
  		var newAvatar = document.getElementById('newAvatar');
  		var template = {
  			username: $scope.user.profile.username,
  			about: $scope.user.profile.about,
  			avatar: $scope.user.profile.avatar,
  			postCount: $scope.user.profile.postCount,
  			replyCount: $scope.user.profile.replyCount,
  			link: $scope.user.profile.link,
  			linkTitle: $scope.user.profile.linkTitle
  		};

  		$('#editProfileModal').modal('hide');
  		
  		if (newAvatar.files[0]) {
  			imgur.upload(newAvatar.files[0]).then(function(model) {
  				console.log(model.link);
  			});
  		}
  		// Get imgur api key! 
  		return Auth.updateProfile(uid, template);
  	};

  	$scope.deletePost = function(postId) {
  		Post.deletePost(postId);
  		$route.reload();
  	};

  	// Broadcasts the postId to the scope, so replies match up to posts,
  	// Then retrieve posts and replies
  	$scope.getPostId = function(post) {
    	thisPostId = post.$id;
    	$scope.viewPost = Post.getPost(thisPostId);
    	$scope.replies = Post.getReplies(thisPostId);
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

  	$scope.uploadAvatar = function(){
  		// Using ng-imgur, get the user's file, upload, then return a string
  		// Send the string to editProfile... ? Or maybe just .$save() the profile.
  	};

    $scope.changePass = function(){
      // 4 inputs: User email, old pass, new pass1, new pass2
      // First, check to make sure newPass1 === newPass2 (else throw error)
      // Then, bundle the object and send to Auth.changePassword(creds)
    };

	$scope.logout = Auth.logout;
});	