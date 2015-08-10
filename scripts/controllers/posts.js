'use strict';


// PostsCtrl handles viewing the main page; specifically loading posts properly
app.controller('PostsCtrl', function ($scope, $route, Post, Auth, Profile, Search) {
  $scope.user = Auth.user;
  $scope.signedIn = Auth.signedIn;
  $scope.logout = Auth.logout;
  $scope.posts = Post.all;
  $scope.post = { title: '', keyword: '', content: '' };
  $scope.reply = { content: '' };
  $scope.search = Search;


  // Necessary to sort posts from newest to oldest
  $scope.reverse = function(array) {
    var copy = [].concat(array);
    return copy.reverse();
  };


  // During ng-repeat(post), get this info ready
  $scope.init = function(thisPost) {
    $scope.attachProfile(thisPost);
    var watchList = $scope.user.profile.watching;
    return Post.scanPost(thisPost, watchList);
  };


  // When viewing a post, get this info ready for the modal
  $scope.loadPost = function(post) {
    if (post.replies) {
      Post.markReplies(post, $scope.user.uid);
    }
    $scope.viewPost = post;
    $scope.attachProfile($scope.viewPost);
  };


  // If a post has new replies, this marks it 
  $scope.checkHighlight = function(thisPost) {
    if (thisPost.highlight) {
      return 'post-notify';
    } else {
      return '';
    }
  };


  // Send a user's profile data to the profile modal
  $scope.loadProfile = function(userId) {
    $scope.viewProfile = Profile.get(userId);
  };


  // When loading a post, add the user's profile data directly to the post
  $scope.attachProfile = function(thisPost) {
    thisPost.profile = Profile.get(thisPost.creatorUID);
    return thisPost;
  };


  // Fetch posts that match a given key/value pair
  // NOTE: This should be made into a filter!
  $scope.getPosts = function(key, value) {
    $scope.posts = Post.getPostsBy(key, value);
  };

  
  // Build the post here, then send the object to the Post Service
  $scope.submitPost = function() {
    var thisTime = timeStamp();
    $scope.post.postTime = thisTime[0];
    $scope.post.postDate = thisTime[1];
    $scope.post.creatorUID = $scope.user.uid;

    if ($('#post-label option:selected').val() === 'Label') {
      $scope.post.keyword = 'Misc';
    } else {
      $scope.post.keyword = $('#post-label option:selected').val();
    }

    Post.addPost($scope.post).then(function() {
      $('#newPostModal').modal('toggle');
      $scope.resetForm();
    });
  };


  // Build the reply here before sending it to the Post Service
  $scope.addReply = function(post) {
    var thisTime = timeStamp();
    $scope.reply.postTime = thisTime[0];
    $scope.reply.postDate = thisTime[1];
    $scope.reply.creatorUID = $scope.user.uid;
    $scope.reply.authorSeen = false;
    
    $('#viewPostModal').modal('toggle');
    return Post.addReply(post, $scope.reply).then(function(){
      $scope.resetForm();
    });
  };


  // Reset form data after submission
  $scope.resetForm = function() {
    $('body').css('padding-right', '0px');  // The modals don't account for scrollbar width properly...?
    $('body').removeClass('modal-open');    // ... probably related to this. It's not closing properly?
    $scope.post = { title: '', keyword: '', content: '' };
    $scope.reply = { content: '' };
  };

});