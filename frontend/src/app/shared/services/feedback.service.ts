import {Injectable} from "@angular/core";
import {Feedback} from "../data/feedback";
import {config} from "../../configs/app.config";
import axios from 'axios'
import {Comment} from "../data/comment";
import {User} from "../data/user";

const url = config.FEEDBACK_SERVICE_URL;

@Injectable()
export class FeedbackService {

    addComment(feedback: Feedback, comment: Comment, currentUser: User) {
        feedback.addComment(comment);
        return axios.post(`${url}/comment`, {
            feedbackID: feedback.getId(),
            comment: comment.getComment(),
            vote: comment.getRate(),
            userID: currentUser.getID(),
            token: currentUser.getToken()
        })
            .then(_ => {
                console.log('success')
            })
            .catch(err => {
                console.error(err.message)
            })
    }

    getComments(currentUser: User, feedback: Feedback) {
        console.log(feedback);
        console.log(currentUser)
        return axios.get(`${url}/comments/${feedback.getId()}`, {params: {token: currentUser.getToken()}})
            .then(resp => {
                let comments: Comment[] = [];
                resp.data.comments.forEach(comment => {
                    comments.push(new Comment(comment.value.comment, comment.value.vote))
                });
                return comments;
            })
            .catch(err => {
                console.error(err.message);
                return []
            })
    }

    getUserFeedbacks(user: User) {
        return axios.get(`${url}/user/${user.getID()}`, {params: {token: user.getToken()}}).then(resp => {
            let feedbacks: Feedback[] = [];
            resp.data.feedbacks.forEach(feedback => {
                let comments: Comment[] = [];
                feedbacks.push(new Feedback(feedback.value.rate, feedback.value.note, comments, feedback.id))
            });
            return feedbacks
        }).catch(err => {
            console.error(err.message);
            return []
        });
    }

    getFeedbacks() {
        return axios.get(`${url}/feedbacks`).then(resp => {
            let feedbacks: Feedback[] = resp.data.feedbacks.map(feedback => {
                return new Feedback(feedback.value.rate, feedback.value.note, [], feedback.id)
            });
            console.log(feedbacks)
            return feedbacks;
        }).catch(err => {
            console.error(err.message);
            return []
        })
    }

    createFeedback(data: any, currentUser: User) {
        return axios.post(`${url}/feedback`, {rate: data.rate, note: data.note, userID: currentUser.getID(), token: currentUser.getToken()})
            .then(_ => {
                console.log("successfully posted new feedback")
            })
            .catch(err => {
                console.error(err.message)
            })
    }
}
