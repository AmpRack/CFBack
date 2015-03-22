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
function getTimeAsString() {
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
  return (hrs + ':' + mins + ampm + ' ' + mon + '/' + day + '/' + year);
}

// PostsCtrl handles new posts and assignments, but not comments
app.controller('PostsCtrl', function ($scope, $location, Post, Auth) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
  $scope.posts = Post.all;

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
  
  // This is the actual posting function
  $scope.submitPost = function () {
  	console.log('Submitting post...');
  	$scope.post.creator = $scope.user.profile.username;
  	$scope.post.creatorUID = $scope.user.uid;
  	$scope.post.postTime = getTimeAsString();
  	
  	if ($('#post-label option:selected').val() === 'Label') {
  		$scope.post.keyword = 'Misc';
  	} else {
  		$scope.post.keyword = $('#post-label option:selected').val();
	 }

    Post.create($scope.post).then(function () {
      $location.path('/main');
      $scope.post = {title: '', label: '', content: ''};
    });
  };

  $scope.deletePost = function (post) {
    Post.delete(post);
  };

});