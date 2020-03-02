import {Component, Input} from "@angular/core";
import {RoutesConfig} from "../../../configs/routes.config";
import {AuthGuard} from "../../guards/auth.guard";
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
})

export class HeaderComponent {
    routes = RoutesConfig.routes;
    @Input() title: string;
    @Input() isUserLoggedIn: boolean;

    constructor(private auth: AuthGuard, private router: Router) {
    }

    logout() {
        this.auth.setLogged(false);
        window.localStorage.clear();
        this.router.navigate([RoutesConfig.routes.home]).catch(err => console.error(err.message))
    }
}
