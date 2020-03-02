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
        if (doc.comment && doc.vote && doc.feedbackID && doc.type) {
          let vote = doc.type === "downvote" ? -1 : 1;
          emit(doc.feedbackID, {doc: doc, vote: vote})
        }
      },
      reduce: function(keys, values) {
        let sum = values.reduce(function(a, b) {
          return a.vote + b.vote
        });

        return sum
      }
    }
  }
};
module.exports = { viewDescriptor };
