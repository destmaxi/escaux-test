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
        if (doc.comment && doc.vote && doc.feedbackID) {
          emit(doc._id, doc)
        }
      }
    }
  }
};
module.exports = { viewDescriptor };
