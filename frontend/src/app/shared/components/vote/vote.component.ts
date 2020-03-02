import {Component, Input} from "@angular/core";
import {AuthenticationService} from "../../services/authentication.service";
import {FeedbackService} from "../../services/feedback.service";
import {Votable} from "../../data/votable";
import {FlashMessagesService} from 'angular2-flash-messages'

@Component({
    selector: "vote",
    templateUrl: "./vote.component.html"
})

export class VoteComponent {
    @Input() votable: Votable;

    constructor(private auth: AuthenticationService, private feedbackService: FeedbackService, private alert: FlashMessagesService) {
    }

    upvote() {
        this.feedbackService.upvote(this.votable.getID(), this.auth.getCurrentUser()).then(_ => {
            this.votable.upvote()
        }).catch(_ => {
            this.alert.show("You already voted for this item!", {cssClass: 'alert-danger', dismiss:true, timeout: 2000, showCloseBtn: true, closeOnClick: true});
            console.error("You already voted for this item")
        })
    }

    downvote() {

        this.feedbackService.downvote(this.votable.getID(), this.auth.getCurrentUser()).then(_ => {
            this.votable.downvote()
        }).catch(_ => {
            this.alert.show("You already voted for this item!", {cssClass: 'alert-danger', dismiss:true, timeout: 2000, showCloseBtn: true, closeOnClick: true});
            console.error("You already voted for this item")
        })
    }
}
