'use strict';

// Transfers post information to and from firebase
app.factory('Post', function ($firebase, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,
    create: function (post) {
      return posts.$add(post);/*.then(function (postRef) {
        Attribute post to user
        $firebase(ref.child('user_posts').child(post.creatorUID)).$push(postRef.name());
        return postRef;
      });*/
    },
    get: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },
    getPostsBy: function (key, value) {
      return $firebase(ref.child('posts')).then(function(posts){
      var output = [];
      console.log('Got key ' + key + ' and value ' + value);
      console.log(posts);
      for (var i = 0; i < posts.length; i++) {
        if (posts[i][key] === value) {
          console.log(posts[i]);
          output.push(posts[i]);
        }
      }
      console.log(output);
      return output;
      });
    },
    delete: function (post) {
      console.log('Attempting to delete post!');
      return $firebase(ref.child('posts')).$remove(post.$id);
    },
    comments: function (post) {
      return $firebase(ref.child('posts').child(post.$id).child('comments')).$asArray();
    },
    addReply: function (post, comment) {
      return $firebase(ref.child('posts').child(post.$id).child('comments')).$push(comment);
    }
  };
	return Post;
});

