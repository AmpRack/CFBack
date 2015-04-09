/* global app:true */
/* exported app */

/**
 * @ngdoc overview
 * @name angNewsApp
 * @description
 * # CodifyApp
 *
 * Main module of the application.
 */

'use strict';

var app = angular
  .module('CodifyApp', [
    'ngAnimate', 'ngCookies' , 'ngResource',
    'ngRoute'  , 'ngSanitize', 'ngTouch'   ,
    'ngImgur'  , 'firebase'
  ])

  .constant('FIREBASE_URL', 'https://burning-heat-6468.firebaseio.com/')

  .directive('ngPlaceholder', function() { // Allows for ng-placeholder="{{ stuff.likeThis }}"
    return {
      restrict: 'A',
      scope: {
        placeholder: '=ngPlaceholder'
      },
      link: function(scope, elem) {
        scope.$watch('placeholder',function() {
          elem[0].placeholder = scope.placeholder;
        });
      }
    };
  })
  
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/login.html',
        controller: 'AuthCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        }
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        }
      })
      .when('/main', {
        templateUrl: '/views/main.html',
        controller: 'PostsCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          }
        }
      })
      .when('/users/:userId', {
        templateUrl: 'views/profile.html',
        controller: 'ProfileCtrl',
        resolve: {
          user: function(Auth) {
            return Auth.resolveUser();
          },
          userPosts: function(Auth, Profile) {
            return Auth.resolveUser().then(function(user){
              return Profile.userPosts(user.uid);
            });
          }
        }
      })
      .otherwise({ // When all else fails, default to login/landing page
        redirectTo: '/'
      });
  });
