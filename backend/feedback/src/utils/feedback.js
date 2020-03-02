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
        db.view('queries', 'feedbacks', function (err, body) {
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

function getVote(id) {
    return new Promise((resolve, reject) => {
        db.view('queries', 'votes', {key: id}, function (err, body) {
            if (!err) {
                if (body.rows.length > 0) {
                    resolve(body.rows[0].value)
                } else {
                    resolve(0)
                }
            } else {
                reject(new Error("Failed to retrieve votes"))
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

function getComment(commentID) {
    return new Promise((resolve, reject) => {
        db.get(commentID, (error, success) => {
            if (success) resolve(success);
            else reject(new Error(error.reason))
        })
    })
}

function upvote(userID, commentID) {
    return new Promise((resolve, reject) => {
        db.insert({
                type: "upvote",
                commentID: commentID,
                userID: userID
            },
            userID + commentID,
            (error, success) => {
                if (success) resolve();
                else reject(new Error(error.reason))
            }
        )
    })
}

function downvote(userID, commentID) {
    return new Promise((resolve, reject) => {
        db.insert({
                type: "downvote",
                commentID: commentID,
                userID: userID
            },
            userID + commentID,
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
    getFeedbacks,
    getComment,
    downvote,
    upvote,
    getVote
};
