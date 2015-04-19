'use strict';

// PostsCtrl handles new posts and assignments, but not comments
app.controller('PostsCtrl', function ($scope, $route, Post, Auth, Profile) {
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.replies = [];
  $scope.viewPost = {};
  $scope.viewUser = {};
  var thisPostId = '';
  var profileId = '';

  // Necessary to sort posts from newest to oldest
  $scope.reverse = function(array) {
    var copy = [].concat(array);
    return copy.reverse();
  };

  // Individual post form info, 
  $scope.post = { title: '', keyword: '', content: '' };
  $scope.reply = { content: '' };
  
  // Build the rest of post here, then send the object to the Post Service
  $scope.submitPost = function() {
  	console.log('Submitting post...');
    var thisTime = timeStamp();
    $scope.post.postTime = thisTime[0];
    $scope.post.postDate = thisTime[1];
    $scope.post.creator = $scope.user.profile.username;
    $scope.post.creatorUID = $scope.user.uid;
    $scope.post.creatorAvatar = $scope.user.profile.avatar;
    $scope.post.replyCount = 0;
    $scope.post.keyword = 'Debug'; /* Testing purposes only!
    if ($('#post-label option:selected').val() === 'Label') {
      $scope.post.keyword = 'Misc';
    } else {
      $scope.post.keyword = $('#post-label option:selected').val();
    }*/
    $('#newPostModal').modal('hide');
    Post.addPost($scope.post).then(function () {
      $scope.resetForm();
      $route.reload();
    });
  };

  // Broadcasts the postId to the scope, so replies match up to posts
  $scope.getPostId = function(post) {
    thisPostId = post.$id;
    $scope.viewPost = Post.getPost(post.$id);
    $scope.replies = Post.getReplies(post.$id);
  };

  $scope.getUserId = function(userId) {
    profileId = userId;
    $scope.viewUser = Profile.get(userId);
    $scope.viewUser.postCount = '';
  };

  $scope.getPosts = function(key, value) {
    $scope.posts = Post.getPostsBy(key, value);
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