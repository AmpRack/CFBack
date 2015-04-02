/* global app:true */
/* exported app */

/**
 * @ngdoc overview
 * @name angNewsApp
 * @description
 * # angNewsApp
 *
 * Main module of the application.
 */

'use strict';

var app = angular
  .module('angNewsApp', [
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
      link: function(scope, elem, attr) {
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
      .when('/posts/:postId', {
        templateUrl: '/views/showpost.html',
        controller:  'PostViewCtrl',
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
          }
        }
      })
      .otherwise({ // When all else fails, default to login/landing page
        redirectTo: '/'
      });
  });
