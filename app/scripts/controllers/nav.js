'use strict';

/* The Nav controller quietly holds most of the authentication system
   since it needs to link to the user profile, logout, etc...
   Though, if the logout option gets moved to the profile page (and profile
   editing can happen live-on-page), there may not be much need for a navctlr */

app.controller('NavCtrl', function ($scope, $location, Post, Auth) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
});