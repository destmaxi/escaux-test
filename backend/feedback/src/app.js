const express = require('express');
const app = express.Router();
const db = require('./utils/feedback');
const auth = process.env.USER_SERVICE_URL;
const axios = require('axios');

/**
 * isConnected -- Check if the token is a valid token by asking the users micro-service
 *
 * @param {String} token the token to be verified
 *
 * @returns {Promise} a promise with a call to the users microservice
 */
function isConnected(token) {
    return new Promise((resolve, reject) => {
        axios.get(`${auth}/isconnected/${token}`)
            .then(res => {
                resolve("")
            })
            .catch(err => {
                reject(new Error(err.response.status))
            })
    })
}

/**
 * API to add a new feedback
 * request body:
 *  - rate: _
 *  - note: _
 *  - token: _
 *
 * @param {String} rate the rate of the feedback
 * @param {String} note the note of the feedback
 * @param {String} token the token of the user
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params
 *                        and 500 otherwise.
 */
app.post('/feedback', (req, res) => {
    if (!(req.body.hasOwnProperty('note') && req.body.hasOwnProperty('rate') && req.body.hasOwnProperty(('token')) && req.body.hasOwnProperty('userID'))) {
        res.status(400).json({message: 'bad request'});
        return
    }

    const rate = req.body.rate;
    const note = req.body.note;
    const token = req.body.token;
    const userID = req.body.userID;
    isConnected(token).then(_ => {
        return db.createFeedback(rate, note, userID)
            .then(_ => {
                res.status(200).json({message: `Feedback for user (${userID}) successfully created`})
            })
            .catch(err => {
                res.status(500).json({message: String(err)})
            })
    }).catch(err => {
        res.status(err.message).json({message: 'permission denied'})
    });
});

/**
 * API to get all feedbacks
 * request params:
 *  -
 *
 *  @returns {Status code} 200 in case of success, 500 otherwise
 *
 *  @returns in case of success, the list of feedbacks
 */
app.get('/feedbacks', (req, res) => {
    return db.getFeedbacks().then(feedbacks => {
        res.status(200).json({feedbacks: feedbacks})
    }).catch(err => {
        res.status(500).json({message: err.message})
    })
});

/**
 * API to check if the credentials are correct
 * request params:
 *  - userID: _
 *
 *  request query:
 *  - token: _
 *
 * @param {String} userID the user id of the user from who you want to retrieve the feedbacks
 * @param {String} token the token of the user who made the request
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params
 *                        and 500 otherwise
 *
 * @returns in case of success, the feedbacks of the desired user
 */
app.get('/user/:userID', (req, res) => {
    if (!(req.params.hasOwnProperty('userID') && req.query.hasOwnProperty('token'))) {
        res.status(400).json({status: 'bad request'});
        return
    }

    const userID = req.params.userID;
    const token = req.query.token;
    isConnected(token).then(_ => {
        return db.getUserFeedbacks(userID).then(feedbacks => {
            res.status(200).json({feedbacks: feedbacks})
        }).catch(err => {
            res.status(500).json({message: err.message})
        })
    }).catch(err => {
        console.log(err);
        res.status(err.message).json({message: 'permission denied'})
    });
});

/**
 * API to get the comments of a feedback
 * request params:
 *  - feedbackID: _
 *
 * request query:
 *  - token: _
 *
 * @param {String} token the token of the user which makes the request
 * @param {String} feedbackID the id of the feedback from which the comments must be retrieved
 *
 * @returns {status code} 200 in case of success, 400 in case of missing params,
 *                        403 in case of invalid token and 500 otherwise
 *
 * @returns in case of success, the comments of the desired feedback
 */
app.get('/comments/:feedbackID', (req, res) => {
    if (!(req.params.hasOwnProperty('feedbackID') && req.query.hasOwnProperty('token'))) {
        res.status(400).json({status: 'bad request'});
        return
    }

    const token = req.query.token;
    const feedbackID = req.params.feedbackID;
    isConnected(token).then(_ => {
        return db.getComments(feedbackID).then(messages => {
            res.status(200).json({comments: messages})
        }).catch(err => {
            res.status(500).json({status: `could not get messages. Reason: ${err.message}`})
        })
    }).catch(err => {
        res.status(err.message).json({status: 'permission denied'})
    })
});

/**
 * API to add a comment for a given feedback
 * request body:
 *  - comment: _
 *  - vote: _
 *  - userID: _
 *  - feedbackID: _
 *  - token: _
 *
 * @param {String} comment the comment for the given feedback
 * @param {number} vote the actual vote for the given comment
 * @param {String} userID the id of the user which makes the comment
 * @param {String} feedbackID the id of the feedback related to the comment
 * @param {String} token the token of the user which makes the request
 *
 * @returns 200 in case of success, 400 in case of missing params, 403 in case of invalid token
 *          and 500 otherwise.
 *
 */
app.post('/comment', (req, res) => {
    console.log(req.body);
    if (!(req.body.hasOwnProperty('token') && req.body.hasOwnProperty('vote') && req.body.hasOwnProperty('comment') && req.body.hasOwnProperty('userID') && req.body.hasOwnProperty('feedbackID'))) {
        res.status(400).json({message: 'bad request'});
        return
    }
    console.log("help");

    const token = req.body.token;
    const vote = req.body.vote;
    const userID = req.body.userID;
    const feedbackID = req.body.feedbackID;
    const comment = req.body.comment;
    isConnected(token).then(_ => {
        return db.createComment(feedbackID, userID, {comment: comment, vote: vote})
            .then(_ => {
                res.status(200).json({message: 'successfully created a new comment'})
            })
            .catch(err => {
                res.status(500).json({message: err.messages})
            })
    }).catch(err => {
        res.status(err.message).json({message: 'permission denied'})
    })
});

/**
 * API to retrieve a particular comment
 *
 * request params:
 *  - commentID: _
 *
 * request query:
 *  - token: _
 *
 *  @param {String} commentID the id of the comment to be retrieved
 *  @param {String} token the token of the user
 *
 *  @returns {Status code} 200 in case of success, 400 in case of invalid request and 500 otherwise
 *
 *  @returns in case of success, the comment with id: commentID
 */
app.get('/comment/:commentID', (req, res) => {
   if (!(req.params.hasOwnProperty('commentID') && req.query.hasOwnProperty('token'))) {
       res.status(400).json({message: 'invalid request'});
       return
   }

   const token = req.query.token;
   const commentID =req.params.commentID;
   isConnected(token).then(_ => {
       return db.getComment(commentID).then(comment => {
           res.status(200).json({comment:comment})
       }).catch(err => {
           res.status(500).json({message: err.message})
       })
   }).catch(err => {
       res.status(err.message).json({message: 'permission denied'})
   })
});

/**
 * API to upvote a comment
 */
app.put('/upvote', (req, res) => {
    console.log(req.body);
    if (!(req.body.hasOwnProperty('token') && req.body.hasOwnProperty('commentID') && req.body.hasOwnProperty('userID'))) {
        res.status(400).json({message: 'invalid request'});
        return
    }

    isConnected(req.body.token).then(_ => {
        return db.upvote(req.body.userID, req.body.commentID).then(_ => {
            res.status(200).json({message: 'successfully upvoted'})
        }).catch(err => {
            res.status(500).json({message: err.message})
        })
    }).catch(err => {
        res.status(err.message).json({message: 'permission denied'})
    })
});


/**
 * API to downvote a comment
 */
app.put('/downvote', (req, res) => {
    if (!(req.body.hasOwnProperty('token') && req.body.hasOwnProperty('commentID') && req.body.hasOwnProperty('userID'))) {
        res.status(400).json({message: 'invalid request'});
        return
    }

    console.log(req.body.userID);

    isConnected(req.body.token).then(_ => {
        return db.downvote(req.body.userID, req.body.commentID).then(_ => {
            res.status(200).json({message: 'successfully upvoted'})
        }).catch(err => {
            res.status(500).json({message: err.message})
        })
    }).catch(err => {
        res.status(err.message).json({message: 'permission denied'})
    })
});

/**
 * API to retrieve the votes of a give id
 */
app.get('/votes/:id', (req, res) => {
    if (!(req.params.hasOwnProperty('id') && req.query.hasOwnProperty('token'))){
        res.status(400).json({message: "invalid request"});
        return
    }

    isConnected(req.query.token).then (_ => {
        return db.getVote(req.params.id).then(vote => {
            res.status(200).json({vote: vote})
        }).catch(err => {
            res.status(500).json({message: err.message})
        })
    }).catch(err => {
        res.status(err.message).json({message: err.message})
    })
});

app.get('/', (req, res) => {
    return res.status(200).json({status: 'success'})
});

module.exports = app;
