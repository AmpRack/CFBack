'use strict';

// Transfers post information to and from firebase
app.factory('Post', function ($firebase, FIREBASE_URL) {
	var ref = new Firebase(FIREBASE_URL);
	var posts = $firebase(ref.child('posts')).$asArray();

  var Post = {
    all: posts,

    // Add the post the firebase first, then increment user.postCount
    addPost: function (post) {
      console.log('Adding post...');
      return posts.$add(post).then(function(){
        return $firebase(ref.child('profile').child(post.creatorUID)).$asObject().$loaded().then(function(thisUser) {
          thisUser.postCount += 1;
          return thisUser.$save();
        });
      });
    },

    // Add the reply to firebase first, then increment the replyCount for the post and user.
    addReply: function (reply) {
      console.log('Adding reply...');
      return $firebase(ref.child('replies').child(reply.parentId)).$push(reply).then(function(){
        return $firebase(ref.child('posts').child(reply.parentId)).$asObject().$loaded().then(function(thisPost) {
          thisPost.replyCount += 1;
          //return thisPost.$save();
        }).then(function() {
          return $firebase(ref.child('profile').child(reply.creatorUID)).$asObject().$loaded().then(function(thisUser) {
            thisUser.replyCount += 1;
            return thisUser.$save();
          });
        });
      });
    },

    // It would be easy to decrement user.postCount, but I dunno about user.replyCount...
    deletePost: function (postId) {
      console.log('Deleting post...');
      return $firebase(ref.child('posts')).$remove(postId).then(function(){
        if ($firebase(ref.child('replies').child(postId))) {
          console.log('Deleting replies...');
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
      //return $firebase(ref.child('replies').child(postId)).numChildren();
    },
    
    // Get each post, break the content and title into an array, then check each word against the searchTerm
    searchPosts: function(searchTerm) {
      return $firebase(ref.child('posts')).$asArray().$loaded().then(function(posts){
        var output = [];
        for (var i = 0; i < posts.length; i++) {
          var matchFound = false;
          var content = posts[i].content.split('');
          content.push(posts[i].title.split(''));
          for (var j = 0; j < content.length; j++) {
            if (!matchFound) { 
              if (content[j].toLowerCase() === searchTerm.toLowerCase()) {
                matchFound = true;
                output.push(posts[i]);
              }
            }
          }
        }
        return output; 
      });
    }

  };
	return Post;
});

