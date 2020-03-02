const viewDescriptor = {
  views: {
    feedbacks: {
      map: function (doc) {
        if (doc.userID && doc.rate && doc.note) {
          /* eslint-disable */
          emit(doc.userID, doc)
          /* eslint-enable */
        }
      }
    },
    comments: {
      map: function (doc) {
        if (doc.comment && doc.feedbackID) {
          emit(doc.feedbackID, doc)
        }
      }
    },
    votes: {
      map: function (doc) {
        if ((doc.type === "downvote" || doc.type === "upvote") && doc.commentID) {
          const vote = doc.type === "downvote" ? -1 : 1;
          emit(doc.commentID, vote)
        }
      },
      reduce: function (keys, values, rereduce) {
        return values.reduce(function(a, b) {
          return a + b
        });
      }
    }
  }
};
module.exports = { viewDescriptor };
