'use strict';

// Transfers post information to and from firebase
app.factory('Post', function ($firebase, FIREBASE_URL, $q) {
	var ref = new Firebase(FIREBASE_URL);
	var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,
    create: function (post) {
      return posts.$add(post).then(function (postRef) {
        // Attribute post to user
        $firebase(ref.child('user_posts').child(post.creatorUID)).$push(postRef.name());
        return postRef;
      });
    },
    get: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },
    getPostsBy: function (key, value) {
      var defer = $q.defer();

      $firebase(ref.child('posts')).$asArray().$loaded().then (function(allPosts) {
        var output = [];

      for (var i = 0; i < allPosts.length; i++) {
        if (allPosts[i][key] === value) {
          output.push(allPosts[i]);
        }
      }
        defer.resolve(output);
      });
      return defer.promise;
    },

    delete: function (post) {
      return posts.$remove(post);
    },
    comments: function (postId) {
      return $firebase(ref.child('comments').child(postId)).$asArray();
    }
  };
	return Post;
});

