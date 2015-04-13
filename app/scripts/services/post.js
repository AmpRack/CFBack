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
    getPost: function (postId) {
      return $firebase(ref.child('posts').child(postId)).$asObject();
    },
    getPostsBy: function (key, value) {
      return $firebase(ref.child('posts')).then(function(posts){
      var output = [];
      console.log('Got key ' + key + ' and value ' + value);
      for (var i = 0; i < posts.length; i++) {
        if (posts[i][key] === value) {
          output.push(posts[i]);
        }
      }
      console.log(output);
      return output;
      });
    },
    delete: function (post) {
      console.log('Deleting post...');
      return $firebase(ref.child('posts')).$remove(post.$id).then(function(){
        if ($firebase(ref.child('replies').child(post.$id))) {
            return $firebase(ref.child('replies')).$remove(post.$id);
        }
      });
    },
    getReplies: function (postId) {
      return $firebase(ref.child('replies').child(postId)).$asArray();
    },
    addReply: function (reply, postId) {
      return $firebase(ref.child('replies').child(postId)).$push(reply);
    },
    replyCount: function (postId) {
      return $firebase(ref.child('replies').child(postId)).$asArray().length;
    }
  };
	return Post;
});

