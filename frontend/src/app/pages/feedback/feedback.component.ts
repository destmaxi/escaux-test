import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {FeedbackService} from "../../shared/services/feedback.service";
import {Feedback} from "../../shared/data/feedback";
import {FormBuilder} from "@angular/forms";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
    selector: 'feedback-page',
    templateUrl: './feedback.component.html'
})

export class FeedbackPageComponent implements OnInit {
    feedbacks: Feedback[];
    feedbackForm;

    constructor(private feedbackService: FeedbackService, private formBuilder: FormBuilder, private auth: AuthenticationService) {
        this.feedbackForm = this.formBuilder.group({
            rate: '',
            note: ''
        })
    }

    ngOnInit() {
        this.fetchFeedbacks()
    }

    fetchFeedbacks() {
        this.feedbackService.getFeedbacks(this.auth.getCurrentUser()).then(feedbacks => {
            this.feedbacks = feedbacks;
        })
    }

    fetchUserFeedbacks() {
        this.feedbackService.getUserFeedbacks(this.auth.getCurrentUser()).then(feedbacks => {
            this.feedbacks = feedbacks;
        }).catch(err => {
            console.error(err.message)
        });
    }

    onSubmit(data) {
        this.feedbackForm.reset();
        this.feedbackService.createFeedback(data, this.auth.getCurrentUser()).then(_ => {
            this.fetchFeedbacks()
        });
    }
}
