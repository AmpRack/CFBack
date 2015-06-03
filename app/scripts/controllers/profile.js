'use strict';

// The Profile controller handles user information, account settings
app.controller('ProfileCtrl', function ($scope, $rootScope, $route, $routeParams, Auth, Post, Profile, imgur, Search) {
  var uid = $routeParams.userId;
  $scope.user = Auth.user;
  $scope.posts = Post.getPostsBy('creatorUID', uid);
  $scope.search = Search;


  // When loading the posts to the page, get these ready
  $scope.init = function(thisPost) {
		$scope.attachProfile(thisPost);
		return Post.scanPost(thisPost, uid);
  };
  

  // When loading a post, get the poster's profile
  $scope.attachProfile = function(thisPost) {
    thisPost.profile = Profile.get(thisPost.creatorUID);
    return thisPost;
  };


  // If a post has been highlighted (highlit?), add the post-notify class
  $scope.checkHighlight = function(thisPost) {
  	if (thisPost.highlight) {
  		return 'post-notify';
  	} else {
  		return '';
  	}
  };


  // When viewing a post, load these things to the viewPost modal
  $scope.loadPost = function(post) {
    if ((post.creatorUID === $scope.user.uid) && (post.replies)) {
      Post.markReplies(post);
    }
    $scope.viewPost = post;
    $scope.attachProfile($scope.viewPost);
  };

  
  // Delete an individual post
  $scope.deletePost = function(post) {
    Post.deletePost(post);
    $route.reload();
  };


  // Send a user's profile to the profile modal
  $scope.loadProfile = function(userId) {
    $scope.viewProfile = Profile.get(userId);
  };


  // Build the entire profile here, then send to Profile Service
  $scope.editProfile = function() {
    var template = {
      username: $scope.user.profile.username,
      about: $scope.user.profile.about,
      avatar: $scope.user.profile.avatar,
      postCount: $scope.user.profile.postCount,
      link: $scope.user.profile.link,
      linkTitle: $scope.user.profile.linkTitle
    };

    Profile.update(uid, template);
    console.log($scope.posts);
    $('#editProfileModal').modal('hide');
  };


  // Upload an image to imgur, return the link, then add it to the user's profile
  $scope.uploadAvatar = function() {
    var newAvatar = document.getElementById('newAvatar');
    if (newAvatar.files[0]) {
      imgur.upload(newAvatar.files[0]).then(function(model) {
        var userAv = model.link;
        Profile.setAvatar(uid, userAv);
        $('#uploadAvatarModal').modal('hide');
      });
    }
  };


  // Verify the new password is typed correct, then send to Auth service
  $scope.changePass = function() {
    if ($scope.newPass1 === $scope.newPass2) {
      var userCreds = {
        email: $scope.email,
        oldPassword: $scope.oldPass,
        newPassword: $scope.newPass2
      };

      $('#changePassModal').modal('hide');
      Auth.changePassword(userCreds).then(function() {
        userCreds = {};
        console.log('Password change complete');
      });
    } else {
      // Additional error handling goes here.
    }
  };


  // Build the reply here before sending it to the Post Service
  $scope.addReply = function(postId) {
    var thisTime = timeStamp();
    $scope.reply.postTime = thisTime[0];
    $scope.reply.postDate = thisTime[1];
    $scope.reply.creatorUID = $scope.user.uid;
    $scope.reply.authorSeen = false;
    
    $('#viewPostModal').modal('toggle');
    return Post.addReply(postId, $scope.reply).then(function(){
      $scope.resetForm();
    });
  };


  // When closing modals, reset the local $route
  $scope.resetForm = function() {
    $('body').css('padding-right', '0px');
    $('body').removeClass('modal-open');
    $scope.post = { title: '', keyword: '', content: '' };
    $scope.reply = { content: '' };
    $route.reload();
  };
});	