'use strict';

// PostsCtrl handles new posts and assignments, but not comments
app.controller('PostsCtrl', function ($scope, $location, Post, Auth) {
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.replies = [];
  $scope.createReply = true;
  $scope.showReply = true;
  $scope.viewPost = {};
  var thisPostId = '';

  // Necessary to sort posts from newest to oldest
  $scope.reverse = function(array) {
    var copy = [].concat(array);
    return copy.reverse();
  };

  // Individual posts contain this info, 
  $scope.post = {
    title: '',
    keyword: '',
    content: ''
  };

  $scope.reply = {
    content: ''
  };
  
  // Build the rest of post here, then send the object to the Post Service
  $scope.submitPost = function() {
  	console.log('Submitting post...');
    var thisTime = timeStamp();
    $scope.post.postTime = thisTime[0];
    $scope.post.postDate = thisTime[1];
    $scope.post.creator = $scope.user.profile.username;
    $scope.post.creatorUID = $scope.user.uid;
    $scope.post.creatorAvatar = $scope.user.profile.avatar;
    $scope.post.replies = {};
    $scope.post.keyword = 'Debug'; /* Testing purposes only!
    if ($('#post-label option:selected').val() === 'Label') {
      $scope.post.keyword = 'Misc';
    } else {
      $scope.post.keyword = $('#post-label option:selected').val();
    }*/
    $('#newPostModal').modal('hide');
    Post.create($scope.post).then(function () {
      $scope.resetForm();
      $location.path('/main');
    });
  };

  // Broadcasts the postId to the scope, so replies match up to posts
  $scope.getPostId = function(postId) {
    thisPostId = postId;
    $scope.viewPost = Post.getPost(postId);
    $scope.replies = Post.getReplies(postId);
    $scope.viewPost.replyCount = $scope.replies.length;
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
      $location.path('/main');
    });
  };

  $scope.resetForm = function() {
    $scope.post = {
      title: '',
      keyword: '',
      content: ''
    };
    $scope.reply = {
      content: ''
    };
  };
});