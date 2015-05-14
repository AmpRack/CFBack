'use strict';

// Format raw time units to ##:## ##/##/##
function scrubTime(unit) {
  // For years, we only need the last 2 digits
  if (unit > 2000) {
    unit -= 2000;
  }
  if (unit < 10) {
    unit = ('0' + unit.toString());
  }
  return unit.toString();
}

// Returns date and time as separate, semantic strings
function timeStamp() {
  var currentTime = new Date();
  var hrs  = currentTime.getHours();
  var mins = scrubTime(currentTime.getMinutes());
  var day  = scrubTime(currentTime.getDate());
  var mon  = scrubTime(currentTime.getMonth() + 1);
  var year = scrubTime(currentTime.getFullYear());
  var ampm = '';
  // Use hrs to find the meridian (am/pm) before scrubbing
  if (hrs === 0) {
    hrs = '12';
    ampm = 'AM';
  } else if (hrs > 12) {
    hrs = scrubTime(hrs - 12);
    ampm = 'PM';
  } else {
    hrs = scrubTime(hrs);
    ampm = 'AM';
  }
  var postTime = hrs + ':' + mins + ampm;
  var postDate = mon + '/' + day + '/' + year;
  return [postTime, postDate];
}

// PostsCtrl handles posts, replies, and helps link profile data to posts.
app.controller('PostsCtrl', function ($scope, $route, Post, Auth, Profile, Search) {
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.post = { title: '', keyword: '', content: '' };
  $scope.reply = { content: '' };
  $scope.search = Search;
  
  // Necessary to sort posts from newest to oldest
  $scope.reverse = function(array) {
    var copy = [].concat(array);
    return copy.reverse();
  };



  // Send a user's profile to the profile modal
  $scope.loadProfile = function(user) {
    $scope.viewProfile = user;
  };

  // Fetch posts that match a given key/value pair
  $scope.getPosts = function(key, value) {
    $scope.posts = Post.getPostsBy(key, value);
  };

  $scope.initPost = function(post) {
    post.thisUser = Profile.get(post.creatorUID);
    post.thisReplyCount = Post.replyCount(post.$id);
//    return post;
  };
  
  // Build the post here, then send the object to the Post Service
  $scope.submitPost = function() {
    var thisTime = timeStamp();
    $scope.post.postTime = thisTime[0];
    $scope.post.postDate = thisTime[1];
    $scope.post.creatorUID = $scope.user.uid;
    $scope.post.replyCount = 0;
    $scope.post.keyword = 'Debug'; /* Testing purposes only!
    if ($('#post-label option:selected').val() === 'Label') {
      $scope.post.keyword = 'Misc';
    } else {
      $scope.post.keyword = $('#post-label option:selected').val();
    }*/
    Post.addPost($scope.post).then(function () {
      $('#newPostModal').modal('hide');
    });
  };

  // When viewing a post, load these things
  $scope.loadReplies = function(post) {
    $scope.viewPost = post;
    $scope.replies = Post.getReplies(post.$id);
    $scope.author = Profile.get(post.creatorUID);
  };

  // Build the reply here before sending it to the Post Service
  $scope.addReply = function(postId) {
    var thisTime = timeStamp();
    $scope.reply.postTime = thisTime[0];
    $scope.reply.postDate = thisTime[1];
    $scope.reply.creatorUID = $scope.user.uid;
    $scope.reply.parentId = postId;
    $scope.reply.authorSeen = false;
    
    Post.addReply($scope.reply, postId).then(function() {
      $scope.reply = {content: ''};
    });
  };

  // Reset form data after submission
  $scope.resetForm = function() {
    $scope.post = { title: '', keyword: '', content: '' };
    $scope.reply = { content: '' };
  };
});