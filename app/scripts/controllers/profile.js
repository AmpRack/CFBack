'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, Auth, Post, userPosts, imgur) {
	$scope.user = Auth.user;
	var uid = $routeParams.userId;
	var thisPostId = '';
  var userAv = '';
	$scope.posts = userPosts;

    $scope.uploadAvatar = function() {
  		var newAvatar = document.getElementById('newAvatar');
      if (newAvatar.files[0]) {
        imgur.upload(newAvatar.files[0]).then(function(model) {
          userAv = model.link;
          console.log(userAv);
          return Auth.updateAvatar(uid, userAv).then(function() {
            $('#uploadAvatarModal').modal('hide');
          });
        });
      }
    };

    $scope.editProfile = function() {
      var template = {
        username: $scope.user.profile.username,
        about: $scope.user.profile.about,
        avatar: $scope.user.profile.avatar,
        postCount: $scope.user.profile.postCount,
        replyCount: $scope.user.profile.replyCount,
        link: $scope.user.profile.link,
        linkTitle: $scope.user.profile.linkTitle
      };

      return Auth.updateProfile(uid, template).then(function() {
        $('#editProfileModal').modal('hide');
      });
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
	    
	    $('#viewPostModal').modal('hide');
	    Post.addReply($scope.reply, thisPostId).then(function() {
      		$scope.reply = {content: ''};
      		thisPostId = '';
      		$scope.viewPost = {};
      		$route.reload();
      	});
  	};

    $scope.changePass = function() {
      if ($scope.newPass1 === $scope.newPass2) {
        var userCreds = {
          email: $scope.email,
          oldPass: $scope.oldPass,
          newPass: $scope.newPass2
        };

        $('#changePassModal').modal('hide');
        Auth.changePassword(userCreds).then(function() {
          userCreds = {};
          console.log('Password change complete');
        });
      } else {
        // Error handling
      }

    };

	$scope.logout = Auth.logout;
});	