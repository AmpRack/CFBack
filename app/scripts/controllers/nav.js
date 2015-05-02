'use strict';

/* The NavCtrl really doesnt do much, but it DOES hold authentication
   so the profile can link properly */
app.controller('NavCtrl', function ($scope, $routeParams, Auth) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
  $scope.newReplies = 1;

  // Return true if there are any new replies to any of your posts
  $scope.hasReplies = function() {
  	return ($scope.newReplies > 0);
  };
});