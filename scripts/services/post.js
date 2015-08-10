'use strict';

// Transfers post and replies to and from firebase
app.factory('Post', function (Auth, $routeParams, $rootScope, $firebaseArray, $firebaseObject, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var posts = $firebaseArray(ref.child('posts'));
  
  var Post = {
    all: posts,

    // Add the post the firebase first, add the postId to the user.watching, then increment user.postCount
    addPost: function (post) {
      console.log('Adding post...');
      return posts.$add(post).then(function(postRef){
        return $firebaseObject(ref.child('profile').child(post.creatorUID)).$loaded().then(function(thisUser) {
          var postId = postRef.key();
          var watchList = thisUser.watching;
          watchList[postId] = 0;
          var increment = { postCount: thisUser.postCount + 1, watching: watchList };
          return ref.child('profile').child(post.creatorUID).update(increment);
        });
      });
    },

    // Add the reply to firebase, then add the postId to user.watching
    addReply: function (post, reply) {
      console.log('Adding reply...');
      var postId = post.$id;
      return $firebaseArray(ref.child('posts').child(postId).child('replies')).$add(reply).then(function() {
        return $firebaseObject(ref.child('profile').child(reply.creatorUID)).$loaded().then(function(thisUser) {
          var watchList = thisUser.watching;
          var replyCount = Object.keys(post.replies).length;
          watchList[postId] = replyCount;
          console.log(watchList);
          return ref.child('profile').child(reply.creatorUID).child('watching').update(watchList);
        });
      });
    },
    
    // Remove post from firebase, and decrement user.postCount
    deletePost: function (post) {
      console.log('Deleting post...');
      return $firebaseObject(ref.child('profile').child(post.creatorUID)).$loaded().then(function(thisUser) {
        var decrement = { postCount: thisUser.postCount - 1 };
        ref.child('profile').child(post.creatorUID).update(decrement);
        return ref.child('posts').child(post.$id).remove();
      });
    },

    // Get one specific post
    getPost: function (postId) {
      return $firebaseObject(ref.child('posts').child(postId));
    },

    // Get posts that match a given key/value pair
    getPostsBy: function (key, value) {
      var output = [];
      for (var i = 0; i < posts.length; i++) {
        if (posts[i][key] === value) {
          output.push(posts[i]);
        }
      }
      console.log('Posts for ' + key + '/' + value + ' found!');
      return output;
    },

    // When viewing a post with new replies, update your watchlist
    markReplies: function(post, userId) {
      return $firebaseObject(ref.child('profile').child(userId)).$loaded().then(function(thisUser) {
        var watchList = thisUser.watching;
        var postId = post.$id;
        var replies = post.replies;
        var replyCount = Object.keys(replies).length;
        if (watchList[postId] < replyCount) {
          watchList[postId] = replyCount;
          post.highlight = false;
          return ref.child('profile').child(userId).child('watching').update(watchList);
        }
      });
    },

    // Get a reply count, and detect any unread replies
    scanPost: function(thisPost, watchList) {
      if (!watchList) {
        console.log('No watchList found, setting as empty...');
        watchList = {};
      }

      if (thisPost.replies) {
        var postId = thisPost.$id;
        thisPost.replyCount = Object.keys(thisPost.replies).length;

        // First, verify if this postId is being watched by the user
        // Then, see if the last known replyCount for this post is less than it's current.
        // If so, mark the post for highlighting and enable the reply notifier.
        if (isNumber(watchList[postId]) && watchList[postId] < thisPost.replyCount) {
          console.log('New replies found!');
          if (!$rootScope.newReplies) {
            $rootScope.newReplies = 0;
          }
          $rootScope.newReplies++;
          thisPost.highlight = true;
        } else {
          thisPost.highlight = false;
        }
      } else {
        thisPost.replyCount = 0;
      }

      return thisPost;
    },

    // Retrieve a user's list of tracked posts
    getWatchList: function (userId) {
      return $firebaseObject(ref.child('profile').child(userId).child('watching')).$loaded();
    }
  };

	return Post;
});

