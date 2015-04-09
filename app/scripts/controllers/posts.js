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

// When a post is made, get the current date/time
// Hey dummy! Turn this into something that returns an object!
function getTimeAsString($scope) {
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
  $scope.post.postTime = hrs + ':' + mins + ampm;
  $scope.post.postDate = mon + '/' + day + '/' + year;
//  return (hrs + ':' + mins + ampm + ' ' + mon + '/' + day + '/' + year);
}

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
  	$scope.post.creator = $scope.user.profile.username;
  	$scope.post.creatorUID = $scope.user.uid;
    $scope.post.creatorAvatar = $scope.user.profile.avatar;
    getTimeAsString($scope);
    $scope.post.replies = {};
    $scope.post.keyword = 'Debug'; /* Testing purposes only!
    if ($('#post-label option:selected').val() === 'Label') {
      $scope.post.keyword = 'Misc';
    } else {
      $scope.post.keyword = $('#post-label option:selected').val();
    }*/
    $('#newPostModal').modal('hide');
    Post.create($scope.post).then(function () {
      $scope.post = {title: '', keyword: '', content: ''};
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
    $scope.reply.creator = $scope.user.profile.username;
    $scope.reply.creatorUID = $scope.user.uid;
    $scope.reply.creatorAvatar = $scope.user.profile.avatar;
    getTimeAsString($scope);
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
});