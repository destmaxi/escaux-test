import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Feedback} from "../../data/feedback";
import {FeedbackService} from "../../services/feedback.service";
import {FormBuilder} from "@angular/forms";
import {Comment} from "../../data/comment";
import {AuthenticationService} from "../../services/authentication.service";

@Component({
    selector: 'feedback-item',
    templateUrl: './feedback.component.html'
})

export class FeedbackComponent implements OnInit {
    commentForm;
    selected: boolean;
    @Input() feedback: Feedback;

    constructor(private feedbackService: FeedbackService, private formBuilder: FormBuilder, private auth: AuthenticationService) {
        this.commentForm = this.formBuilder.group({
            comment: 'Write your comment here',
            rate: 'Your rate'
        })
    }

    addComment(comment) {
        this.feedbackService.addComment(this.feedback, new Comment(comment.comment, comment.rate), this.auth.getCurrentUser())
            .then(_ => {this.fetchComments()})
    }

    fetchComments() {
        this.feedbackService.getComments(this.auth.getCurrentUser(), this.feedback).then(comments => {
            comments.forEach(comment => this.feedback.addComment(comment));
        }).catch(err => {
            console.error(err.message)
        })
    }

    ngOnInit() {
        this.fetchComments()
    }

    onClick() {
        this.selected = !this.selected;
    }
}
