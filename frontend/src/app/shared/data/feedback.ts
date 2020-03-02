import {Comment} from "./comment";
import {Votable} from "./votable";

export class Feedback implements Votable {
    constructor(private rate: string, private note: string, private comments: Comment[], private id: string, private value: number=0, private username: string) {

    }

    setComments(comments: Comment[]) {
        this.comments = comments
    }

    getID() {
        return this.id
    }

    getUser() {
        return this.username
    }

    getRating() {
        return this.rate
    }

    getNote() {
        return this.note
    }

    getValue() {
        return this.value
    }

    getComments() {
        return this.comments
    }

    upvote() {
        this.value++
    }

    downvote() {
        this.value--
    }
}
