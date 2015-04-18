'use strict';

// Transfers post information to and from firebase
app.factory('Post', function ($firebase, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,

    create: function (post) {
      return posts.$add(post);
    },

    addReply: function (reply) {
      return $firebase(ref.child('replies').child(reply.parentId)).$push(reply).then(function(){
        console.log(reply.parentId.toString());
        var thisPost = $firebase(ref.child('posts').child(reply.parentId)).$asObject();
        var count = thisPost.replyCount + 1;
        thisPost.replyCount = count;
        return thisPost.$save();
      });
    },

    deletePost: function (postId) {
      return $firebase(ref.child('posts')).$remove(postId);
    },

    deleteReply: function(postId) {
      if ($firebase(ref.child('replies').child(postId))) {
        console.log('Deleting replies...');
        return $firebase(ref.child('replies')).$remove(postId);
      }
    },

    getPost: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },

    getPostsBy: function (key, value) {
      var output = [];
      for (var i = 0; i < posts.length; i++) {
        if (posts[i][key] === value) {
          output.push(posts[i]);
        }
      }
      return output;
    },

    getReplies: function (postId) {
      return $firebase(ref.child('replies').child(postId)).$asArray();
    },

    replyCount: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject().replyCount;
    }

  };
	return Post;
});

