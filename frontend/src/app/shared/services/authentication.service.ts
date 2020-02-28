import {Injectable, OnInit} from "@angular/core";
import axios from 'axios';
import {AuthGuard} from "../guards/auth.guard";
import {RoutesConfig} from "../../configs/routes.config";
import {ActivatedRoute, Router} from "@angular/router";
import {config} from "../../configs/app.config";
import {User} from "../data/user";

const url = config.AUTH_SERVICE_URL;

@Injectable()
export class AuthenticationService implements OnInit {
    private returnUrl: string;
    private currentUser: User;

    constructor(private auth: AuthGuard, private route: ActivatedRoute, private router: Router) {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || `${RoutesConfig.routes.home}`
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || `${RoutesConfig.routes.home}`
    }

    login(username, password) {
        axios.get(`${url}/user/${username}/password/${password}`)
            .then(res => {
                this.auth.setLogged(true);
                this.currentUser = new User(res.data.id, res.data.user.token, res.data.user.username);
                window.localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.return()
            })
            .catch(err => {
                console.error(err.message)
            })
    }

    register(username: string, password: string) {
        axios.post(`${url}/user`, {username: username, password: password})
            .then(res => {
                this.auth.setLogged(true);
                window.localStorage.setItem('authToken', res.data.token);
                this.currentUser = new User(res.data._id, res.data.token, res.data.username);
                this.return()
            })
            .catch(err => {
                console.error(err.message)
            })
    }

    getCurrentUser() {
        if (this.currentUser == null) {
            let user = JSON.parse(window.localStorage.getItem('currentUser'))
            this.currentUser = new User(user.id, user.token, user.username);
        }
        return this.currentUser;
    }

    return() {
        this.router.navigate([this.returnUrl]).catch(err => console.error(err.message))
    }
}
