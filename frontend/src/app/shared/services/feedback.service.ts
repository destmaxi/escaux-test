import {Injectable} from "@angular/core";
import {Feedback} from "../data/feedback";
import {config} from "../../configs/app.config";
import axios from 'axios'
import {Comment} from "../data/comment";
import {User} from "../data/user";
import {FlashMessagesService} from "angular2-flash-messages";

const url = config.FEEDBACK_SERVICE_URL;

@Injectable()
export class FeedbackService {

    constructor(private alert: FlashMessagesService) {
    }

    displayAlert(msg: string, type: string) {
        this.alert.show(msg, {cssClass: `alert-${type}`, dismiss:true, timeout: 2000, showCloseBtn: true, closeOnClick: true});
    }

    addComment(feedback: Feedback, comment: Comment, currentUser: User) {
        return axios.post(`${url}/comment`, {
            feedbackID: feedback.getID(),
            comment: comment.getComment(),
            vote: comment.getValue(),
            userID: currentUser.getID(),
            token: currentUser.getToken()
        })
            .then(_ => {
                this.displayAlert("Success: Comment successfully added!", "success");
                console.log('success')
            })
            .catch(err => {
                this.displayAlert("Error: Failed to add comment!", "danger");
                console.error(err.message)
            })
    }

    getComments(currentUser: User, feedback: Feedback) {
        return axios.get(`${url}/comments/${feedback.getID()}`, {params: {token: currentUser.getToken()}})
            .then(resp => {
                let comments: Comment[] = [];
                resp.data.comments.forEach(comment => {
                    axios.get(`${url}/votes/${comment.id}`, {params: {token: currentUser.getToken()}}).then(resp => {
                        comments.push(new Comment(comment.value.comment, resp.data.vote, comment.id, comment.value.userID))
                    })
                });
                return comments;
            })
            .catch(err => {
                console.error(err.message);
                return []
            })
    }

    getUserFeedbacks(currentUser: User) {
        return axios.get(`${url}/user/${currentUser.getID()}`, {params: {token: currentUser.getToken()}}).then(resp => {
            let feedbacks: Feedback[] = [];
            resp.data.feedbacks.forEach(feedback => {
                let comments: Comment[] = [];
                axios.get(`${url}/votes/${feedback.id}`, {params: {token: currentUser.getToken()}}).then(resp => {
                    feedbacks.push(new Feedback(feedback.value.rate, feedback.value.note, comments, feedback.id, resp.data.vote, feedback.value.userID))
                })
            });
            return feedbacks
        }).catch(err => {
            console.error(err.message);
            return []
        });
    }

    getFeedbacks(currentUser: User) {
        return axios.get(`${url}/feedbacks`).then(resp => {
            let feedbacks: Feedback[] = [];
            resp.data.feedbacks.forEach(feedback => {
                axios.get(`${url}/votes/${feedback.id}`, {params: {token: currentUser.getToken()}}).then(resp => {
                    feedbacks.push(new Feedback(feedback.value.rate, feedback.value.note, [], feedback.id, resp.data.vote, feedback.value.userID))
                })
            });
            return feedbacks;
        }).catch(err => {
            console.error(err.message);
            return []
        })
    }

    createFeedback(data: any, currentUser: User) {
        return axios.post(`${url}/feedback`, {
            rate: data.rate,
            note: data.note,
            userID: currentUser.getID(),
            token: currentUser.getToken()
        })
            .then(_ => {
                this.displayAlert("Success: Feedback successfully added !", "success");
                console.log("successfully posted new feedback")
            })
            .catch(err => {
                this.displayAlert("Error: Failed to add feedback!", "danger");
                console.error(err.message)
            })
    }

    upvote(id: string, currentUser: User) {
        console.log(currentUser);
        return axios.put(`${url}/upvote`, {
            commentID: id,
            userID: currentUser.getID(),
            token: currentUser.getToken()
        })
    }

    downvote(id: string, currentUser: User) {
        return axios.put(`${url}/downvote`, {
            commentID: id,
            userID: currentUser.getID(),
            token: currentUser.getToken()
        })
    }
}
