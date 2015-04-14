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

    addReply: function (reply, postId) {
      return $firebase(ref.child('replies').child(postId)).$push(reply);
    },

    delete: function (postId) {
      console.log('Deleting post...');
      return $firebase(ref.child('posts')).$remove(postId).then(function(){
        if ($firebase(ref.child('replies').child(postId))) {
            return $firebase(ref.child('replies')).$remove(postId);
        }
      });
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
      if ($firebase(ref.child('replies').child(postId)).$asArray()) {
        console.log('Found replies for ' + postId);
        return $firebase(ref.child('replies').child(postId)).$asArray().length;
      } else {
        return 0;
      };
    }

  };
	return Post;
});

