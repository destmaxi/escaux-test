import {Component} from '@angular/core';
import {AuthGuard} from "../../shared/guards/auth.guard";
import {RoutesConfig} from "../../configs/routes.config";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: [
        './home-page.component.css'
    ]
})

export class HomePageComponent {
    routes = RoutesConfig.routes;

    constructor(public auth: AuthGuard, public user: AuthenticationService) {
    }
}
