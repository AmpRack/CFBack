'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, Auth, Post, Profile, userPosts, imgur, Search) {
  $scope.user = Auth.user;
  var uid = $routeParams.userId;
  $scope.posts = userPosts;
  $scope.search = Search;

  // Attach profile data to individual posts
  $scope.attachProfile = function(userId) {
    return Profile.get(userId);
  };

  // Upload an image to imgur, return the link, then add it to the user's profile
  $scope.uploadAvatar = function() {
    var newAvatar = document.getElementById('newAvatar');
    if (newAvatar.files[0]) {
      imgur.upload(newAvatar.files[0]).then(function(model) {
        var userAv = model.link;
        return Profile.setAvatar(uid, userAv).then(function() {
          $('#uploadAvatarModal').modal('hide');
        });
      });
    }
  };

  // Build the entire profile here, then send to Profile Service
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

    return Profile.update(uid, template).then(function() {
      $('#editProfileModal').modal('hide');
    });
  };

  // Delete an individual post
  $scope.deletePost = function(postId) {
    Post.deletePost(postId);
    $route.reload();
  };

  // When viewing a post, get these things ready
  $scope.loadReplies = function(post) {
    $scope.viewPost = Post.getPost(post.$id);
    $scope.replies = Post.getReplies(post.$id);
    $scope.author = Profile.get(post.creatorUID);
  };

  // Build the reply here first, then send to Post Service
  $scope.addReply = function(postId) {
    var thisTime = timeStamp();
    $scope.reply.postTime = thisTime[0];
    $scope.reply.postDate = thisTime[1];
    $scope.reply.creator = $scope.user.profile.username;
    $scope.reply.creatorUID = $scope.user.uid;
    $scope.reply.creatorAvatar = $scope.user.profile.avatar;
    $scope.reply.parentId = postId;
    $scope.reply.authorSeen = false;
    
    $('#viewPostModal').modal('hide');
    Post.addReply($scope.reply, postId).then(function() {
      $scope.reply = {content: ''};
      $scope.viewPost = {};
    });
  };

  // Verify the new password is typed correct, then send to Auth service
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
      // Error handling goes here!
    }

  };

});	