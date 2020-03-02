import {AuthenticationService} from "../services/authentication.service";
import {FeedbackService} from "../services/feedback.service";
import {Votable} from "./votable";

export class Comment implements Votable {
    constructor(private comment: string, private rate: number, private id:string, private username: string) {
    }

    getValue() {
        return this.rate
    }
    getComment() {
        return this.comment
    }

    getUser() {
        return this.username
    }

    getID() {
        return this.id;
    }

    upvote() {
        this.rate++;
    }

    downvote() {
        this.rate--;
    }
}
