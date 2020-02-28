const db = require('nano')(process.env.DB_URL);
const log = require('debug')(process.env.DEBUG);

function createFeedback(rate, note, userID) {
    return new Promise((resolve, reject) => {
        db.insert(
            {
                'rate': rate,
                'note': note,
                'userID': userID,
            },
            (error, success) => {
                if (success) {
                    resolve()
                } else {
                    reject(
                        new Error(`In the creation of feedback for user (${userID}). Reason: ${error.reason}.`)
                    )
                }
            }
        )
    })
}

function getFeedbacks() {
    return new Promise((resolve, reject) => {
        db.view('queries', 'feedbacks', function(err, body) {
            if (!err) {
                resolve(body.rows)
            } else {
                reject(new Error(`could not retrieve feedbacks. Reason: ${err.message}`))
            }
        })
    })
}

function getUserFeedbacks(userID) {
    return new Promise((resolve, reject) => {
        db.view('queries', 'feedbacks', {key: userID}, function (err, body) {
            if (!err) {
                log(body.rows);
                resolve(body.rows)
            } else {
                reject(new Error(`could not retrieve feedbacks. Reason: ${err.message}`))
            }
        })
    })
}

function getComments(feedbackID) {
    return new Promise((resolve, reject) => {
        db.view('queries', 'comments', {key: feedbackID}, function (err, body) {
            if (!err) {
                resolve(body.rows)
            } else {
                reject(new Error(`could not retrieve comments of feedback (${feedbackID}). Reason: ${err.message}`))
            }
        })
    })
}

function createComment(feedbackID, userID, comment) {
    //TODO: check feedback id exist before adding?
    console.log(comment);
    return new Promise((resolve, reject) => {
        db.insert(
            {
                'comment': comment.comment,
                'vote': comment.vote,
                'userID': userID,
                'feedbackID': feedbackID
            },
            (error, success) => {
                if (success) resolve();
                else reject(new Error(error.reason))
            }
        )
    })
}

module.exports = {
    createFeedback,
    getUserFeedbacks,
    getComments,
    createComment,
    getFeedbacks
};
