'use strict';

app.controller('ProfileCtrl', function ($scope, $route, $routeParams, Auth, Post, Profile, userPosts, imgur) {
  $scope.user = Auth.user;
  var uid = $routeParams.userId;
  $scope.posts = userPosts;

  $scope.attachProfile = function(userId) {
    return Profile.get(userId);
  };

  $scope.uploadAvatar = function() {
    var newAvatar = document.getElementById('newAvatar');
    if (newAvatar.files[0]) {
      imgur.upload(newAvatar.files[0]).then(function(model) {
        var userAv = model.link;
        console.log(userAv);
        return Profile.setAvatar(uid, userAv).then(function() {
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

    return Profile.update(uid, template).then(function() {
      $('#editProfileModal').modal('hide');
    });
  };

  $scope.deletePost = function(postId) {
    Post.deletePost(postId);
    $route.reload();
  };

  // Broadcasts the postId to the scope, so replies match up to posts,
  // Then retrieve posts and replies
  $scope.loadPost = function(post) {
    $scope.thisUser = $scope.attachProfile(post.creatorUID);
    $scope.replyCount = Post.replyCount(post.$id);
  };

  $scope.loadReplies = function(post) {
    $scope.viewPost = Post.getPost(post.$id);
    $scope.replies = Post.getReplies(post.$id);
    $scope.author = Profile.get(post.creatorUID);
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

});	