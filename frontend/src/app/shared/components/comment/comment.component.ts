import {Component, Input} from "@angular/core";
import {Comment} from "../../data/comment";

@Component({
    selector: 'comment',
    templateUrl: './comment.component.html'
})

export class CommentComponent {
    @Input() comment: Comment
}
