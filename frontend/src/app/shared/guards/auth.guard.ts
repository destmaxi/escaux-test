import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {Observable} from "rxjs";
import {RoutesConfig} from "../../configs/routes.config";

@Injectable()
export class AuthGuard implements CanActivate {
    private logged: boolean;

    constructor(private router: Router) {
        this.logged = !!window.localStorage.getItem("currentUser");
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        if (this.logged) {
            return true;
        }

        this.router.navigate([RoutesConfig.routesNames.login], {queryParams: {returnUrl: state.url, logged: this.logged}})
        return false;

    }

    setLogged(logged: boolean) {
        this.logged = logged;
    }

    isLogged(): boolean {
        return this.logged;
    }
}
