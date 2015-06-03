"use strict";function scrubTime(a){return a>2e3&&(a-=2e3),10>a&&(a="0"+a.toString()),a.toString()}function timeStamp(){var a=new Date,b=a.getHours(),c=scrubTime(a.getMinutes()),d=scrubTime(a.getDate()),e=scrubTime(a.getMonth()+1),f=scrubTime(a.getFullYear()),g="";0===b?(b="12",g="AM"):b>12?(b=scrubTime(b-12),g="PM"):(b=scrubTime(b),g="AM");var h=b+":"+c+g,i=e+"/"+d+"/"+f;return[h,i]}$(document).ready(function(){function a(a){a.toggleClass("hidden"),a.toggleClass("wrapped-up")}$("#nav-searchbar").on("focus","input",function(){$(this).parent().addClass("search-focus")}),$("#nav-searchbar").on("focusout","input",function(){$(this).parent().removeClass("search-focus")}),$("#show-reply").on("click",function(){var b=$(this).parentsUntil(".post-template").last().siblings(".replies");a(b)}),$("#create-reply").on("click",function(){var b=$(this).parentsUntil(".post-template").last().siblings(".post-reply");a(b)}),$("button#cancel-reply").on("click",function(){var b=$(this).parentsUntil(".post-template").last();a(b)})});var app=angular.module("ConclaveApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","ngImgur","firebase"]).constant("FIREBASE_URL","https://burning-heat-6468.firebaseio.com/").directive("ngPlaceholder",function(){return{restrict:"A",scope:{placeholder:"=ngPlaceholder"},link:function(a,b){a.$watch("placeholder",function(){b[0].placeholder=a.placeholder})}}}).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/login.html",controller:"AuthCtrl",resolve:{user:["Auth",function(a){return a.resolveUser()}]}}).when("/main",{templateUrl:"/views/main.html",controller:"PostsCtrl",resolve:{user:["Auth",function(a){return a.resolveUser()}]}}).when("/users/:userId",{templateUrl:"views/profile.html",controller:"ProfileCtrl",resolve:{user:["Auth",function(a){return a.resolveUser()}],userPosts:["Profile","Auth",function(a,b){var c=b.resolveUser();return a.userPosts(c.uid)}]}}).otherwise({redirectTo:"/"})}]);app.factory("Auth",["$firebaseAuth","$firebaseObject","FIREBASE_URL","$rootScope","$location",function(a,b,c,d,e){var f=new Firebase(c),g=a(f),h={register:function(a){return g.$createUser(a)},login:function(a){return g.$authWithPassword(a)},logout:function(){g.$unauth()},resolveUser:function(){return g.$getAuth()},signedIn:function(){return!!h.user.provider},resetPassword:function(a){return console.log("Requesting new password email..."),g.$sendPasswordResetEmail(a)},changePassword:function(a){return console.log("Changing password"),g.$changePassword(a)},user:{}};return g.$onAuth(function(a){a?($("#nav-master").css("display","block"),angular.copy(a,h.user),h.user.profile=b(f.child("profile").child(a.uid)),console.log("Logged in.")):(h.user&&h.user.profile&&h.user.profile.$destroy(),angular.copy({},h.user),$("#nav-master").css("display","none"),console.log("Redirecting to login"),e.path("/"))}),h}]),app.factory("Post",["$routeParams","$rootScope","$firebaseArray","$firebaseObject","FIREBASE_URL",function(a,b,c,d,e){var f=new Firebase(e),g=c(f.child("posts")),h={all:g,addPost:function(a){return console.log("Adding post..."),g.$add(a).then(function(){return d(f.child("profile").child(a.creatorUID)).$loaded().then(function(b){var c={postCount:b.postCount+1};return f.child("profile").child(a.creatorUID).update(c)})})},addReply:function(a,b){return console.log("Adding reply..."),c(f.child("posts").child(a).child("replies")).$add(b)},deletePost:function(a){return console.log("Deleting post..."),d(f.child("profile").child(a.creatorUID)).$loaded().then(function(b){var c={postCount:b.postCount-1};return f.child("profile").child(a.creatorUID).update(c),f.child("posts").child(a.$id).remove()})},getPost:function(a){return d(f.child("posts").child(a))},getPostsBy:function(a,b){for(var c=[],d=0;d<g.length;d++)g[d][a]===b&&c.push(g[d]);return console.log("Posts for "+a+"/"+b+" found!"),c},markReplies:function(a){var b=a.$id,c=a.replies;for(var d in c)c[d].authorSeen=!0,delete c[d].profile;return f.child("posts").child(b).child("replies").update(c)},scanPost:function(a,c){if(a.replyCount=0,a.replies)for(var d in a.replies){a.replyCount++;var e=a.replies[d];e.authorSeen===!1&&e.creatorUID!==a.creatorUID&&(c===a.creatorUID?(b.newReplies=!0,a.highlight=!0):a.highlight=!1)}return a}};return h}]),app.factory("Profile",["Post","$rootScope","$firebaseObject","$firebaseArray","FIREBASE_URL",function(a,b,c,d,e){var f=new Firebase(e),g=f.child("profile"),h={create:function(a){var b=a.uid,c={about:"I'm a student at Codify Academy!",avatar:"http://i.imgur.com/QGpIArR.jpg",postCount:0,link:"http://www.codifyacademy.com/",linkTitle:"Codify Academy Homepage",uid:a.uid,username:a.username};return console.log("New user "+a.username+" created!"),g.child(b).set(c)},get:function(a){return c(g.child(a))},update:function(a,b){return console.log("Profile updated."),g.child(a).update(b)},setAvatar:function(a,b){return console.log("Avatar updated."),g.child(a).child("avatar").set(b)},userPosts:function(a){return d(f.child("posts")).$loaded().then(function(b){for(var c=[],d=0;d<b.length;d++)b[d].creatorUID===a&&c.push(b[d]);return c})}};return h}]),app.controller("AuthCtrl",["$scope","$rootScope","$location","Auth","user","Profile",function(a,b,c,d,e,f){e&&c.path("/main"),a.login=function(){d.login(a.user).then(function(){b.newReplies=!1,b.ignoreAlert=!1,c.path("/main")},function(b){a.error=b.toString()})},a.register=function(){d.register(a.user).then(function(b){return d.login(a.user).then(function(){return b.username=a.user.username,f.create(b)}).then(function(){c.path("/main")})},function(b){a.error=b.toString()})},a.resetPass=function(){d.resetPassword(a.userEmail)}}]),app.controller("NavCtrl",["$scope","$rootScope","Auth","Search",function(a,b,c,d){a.signedIn=c.signedIn,a.user=c.user,a.logout=c.logout,a.search=d,a.dismissAlert=function(){b.ignoreAlert=!0,b.newReplies=!1},a.alertButton=function(){return b.ignoreAlert?!1:b.newReplies?!0:!1}}]),app.controller("PostsCtrl",["$scope","$route","$rootScope","Post","Auth","Profile","Search",function(a,b,c,d,e,f,g){a.user=e.user,a.signedIn=e.signedIn,a.logout=e.logout,a.posts=d.all,a.post={title:"",keyword:"",content:""},a.reply={content:""},a.search=g,a.reverse=function(a){var b=[].concat(a);return b.reverse()},a.init=function(b){return a.attachProfile(b),d.scanPost(b,a.user.uid)},a.loadPost=function(b){b.creatorUID===a.user.uid&&b.replies&&d.markReplies(b),a.viewPost=b,a.attachProfile(a.viewPost)},a.loadProfile=function(b){a.viewProfile=f.get(b)},a.attachProfile=function(a){return a.profile=f.get(a.creatorUID),a},a.getPosts=function(b,c){a.posts=d.getPostsBy(b,c)},a.submitPost=function(){var b=timeStamp();a.post.postTime=b[0],a.post.postDate=b[1],a.post.creatorUID=a.user.uid,a.post.keyword="Label"===$("#post-label option:selected").val()?"Misc":$("#post-label option:selected").val(),d.addPost(a.post).then(function(){$("#newPostModal").modal("toggle")})},a.addReply=function(b){var c=timeStamp();return a.reply.postTime=c[0],a.reply.postDate=c[1],a.reply.creatorUID=a.user.uid,a.reply.authorSeen=!1,$("#viewPostModal").modal("toggle"),d.addReply(b,a.reply).then(function(){a.resetForm()})},a.resetForm=function(){$("body").css("padding-right","0px"),$("body").removeClass("modal-open"),a.post={title:"",keyword:"",content:""},a.reply={content:""},b.reload()}}]),app.controller("ProfileCtrl",["$scope","$rootScope","$route","$routeParams","Auth","Post","Profile","imgur","Search",function(a,b,c,d,e,f,g,h,i){var j=d.userId;a.user=e.user,a.posts=f.getPostsBy("creatorUID",j),a.search=i,a.init=function(b){return a.attachProfile(b),f.scanPost(b,j)},a.attachProfile=function(a){return a.profile=g.get(a.creatorUID),a},a.checkHighlight=function(a){return a.highlight?"post-notify":""},a.loadPost=function(b){b.creatorUID===a.user.uid&&b.replies&&f.markReplies(b),a.viewPost=b,a.attachProfile(a.viewPost)},a.deletePost=function(a){f.deletePost(a),c.reload()},a.loadProfile=function(b){a.viewProfile=g.get(b)},a.editProfile=function(){var b={username:a.user.profile.username,about:a.user.profile.about,avatar:a.user.profile.avatar,postCount:a.user.profile.postCount,link:a.user.profile.link,linkTitle:a.user.profile.linkTitle};g.update(j,b),console.log(a.posts),$("#editProfileModal").modal("hide")},a.uploadAvatar=function(){var a=document.getElementById("newAvatar");a.files[0]&&h.upload(a.files[0]).then(function(a){var b=a.link;g.setAvatar(j,b),$("#uploadAvatarModal").modal("hide")})},a.changePass=function(){if(a.newPass1===a.newPass2){var b={email:a.email,oldPassword:a.oldPass,newPassword:a.newPass2};$("#changePassModal").modal("hide"),e.changePassword(b).then(function(){b={},console.log("Password change complete")})}},a.addReply=function(b){var c=timeStamp();return a.reply.postTime=c[0],a.reply.postDate=c[1],a.reply.creatorUID=a.user.uid,a.reply.authorSeen=!1,$("#viewPostModal").modal("toggle"),f.addReply(b,a.reply).then(function(){a.resetForm()})},a.resetForm=function(){$("body").css("padding-right","0px"),$("body").removeClass("modal-open"),a.post={title:"",keyword:"",content:""},a.reply={content:""},c.reload()}}]),app.factory("Search",function(){return{searchPosts:""}});