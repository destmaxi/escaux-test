import {Comment} from "./comment";

export class Feedback {
    constructor(private rate: string, private note: string, private comments: Comment[], private id: string) {

    }

    addComment(comment: Comment) {
        this.comments.push(comment)
    }

    getId() {
        return this.id
    }

    getRating() {
        return this.rate
    }

    getNote() {
        return this.note
    }

    getComments() {
        return this.comments
    }
}
