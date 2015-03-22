'use strict';

/* The Nav controller ties to the Auth service, to see if we're logged in or not */

app.controller('NavCtrl', function ($scope, $routeParams, Auth) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
});