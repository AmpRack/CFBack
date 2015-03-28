'use strict';

/* The NavCtrl really doesnt do much, but it DOES hold authentication
   so the profile can link properly */

app.controller('NavCtrl', function ($scope, $routeParams, Auth) {
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.user = Auth.user;
});