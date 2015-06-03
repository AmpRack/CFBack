'use strict';

// Transfers post and replies to and from firebase
app.factory('Post', function ($routeParams, $rootScope, $firebaseArray, $firebaseObject, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var posts = $firebaseArray(ref.child('posts'));


  var Post = {
    all: posts,

    // Add the post the firebase first, then increment user.postCount
    addPost: function (post) {
      console.log('Adding post...');
      return posts.$add(post).then(function(){
        return $firebaseObject(ref.child('profile').child(post.creatorUID)).$loaded().then(function(thisUser) {
          var increment = { postCount: thisUser.postCount + 1 };
          return ref.child('profile').child(post.creatorUID).update(increment);
        });
      });
    },

    // Add the reply to firebase
    addReply: function (postId, reply) {
      console.log('Adding reply...');
      return $firebaseArray(ref.child('posts').child(postId).child('replies')).$add(reply);
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

    // When viewing our own post, mark all attached replies as 'seen'
    markReplies: function(post) {
      var postId = post.$id;
      var replies = post.replies;
      for (var reply in replies) {
        replies[reply].authorSeen = true;
        delete replies[reply].profile;
      }
      return ref.child('posts').child(postId).child('replies').update(replies);
    },

    // Get a reply count, and detect any unread replies
    scanPost: function(thisPost, userId) {
      thisPost.replyCount = 0;
      if (thisPost.replies) {
        for (var reply in thisPost.replies) {
          thisPost.replyCount++;
          var thisReply = thisPost.replies[reply];
          if ((thisReply.authorSeen === false) && (thisReply.creatorUID !== thisPost.creatorUID)) {
            if (userId === thisPost.creatorUID) {
              $rootScope.newReplies = true;
              thisPost.highlight = true;
            } else {
              thisPost.highlight = false;
            }
          }
        }
      }
      return thisPost;
    }
  };

	return Post;
});

