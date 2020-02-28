import {Component} from '@angular/core';
import {AuthGuard} from "./shared/guards/auth.guard";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})

export class AppComponent {
    constructor(public auth: AuthGuard) {
    }
}
