'use strict';

// The NavCtrl runs the new-reply notifier, and links to the profile page
app.controller('NavCtrl', function ($scope, $rootScope, Auth, Search) {
  $scope.signedIn = Auth.signedIn;
  $scope.user = Auth.user;
  $scope.logout = Auth.logout;
  $scope.search = Search;


  // Click the notifier, this should load up posts with new replies on the profile page
  $scope.dismissAlert = function() { 
    $rootScope.ignoreAlert = true;
    $rootScope.newReplies = false;
  };


  // Toggles the button on/off if there are new replies
  $scope.alertButton = function() {
    if ($rootScope.ignoreAlert) {
      return false;
    } else if ($rootScope.newReplies) {
      return true;
    } else {
    	return false;
  	}
  };

});

