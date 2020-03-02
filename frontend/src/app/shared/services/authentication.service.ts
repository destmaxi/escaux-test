import {Injectable, OnInit} from "@angular/core";
import axios from 'axios';
import {AuthGuard} from "../guards/auth.guard";
import {RoutesConfig} from "../../configs/routes.config";
import {ActivatedRoute, Router} from "@angular/router";
import {config} from "../../configs/app.config";
import {User} from "../data/user";
import {FlashMessagesService} from "angular2-flash-messages";

const url = config.AUTH_SERVICE_URL;

@Injectable()
export class AuthenticationService implements OnInit {
    private returnUrl: string;
    private currentUser: User;

    constructor(private auth: AuthGuard, private route: ActivatedRoute, private router: Router, private alert: FlashMessagesService) {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || `${RoutesConfig.routes.home}`
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || `${RoutesConfig.routes.home}`
    }

    displayAlert(msg: string, type: string) {
        this.alert.show(msg, {cssClass: `alert-${type}`, dismiss:true, timeout: 2000, showCloseBtn: true, closeOnClick: true});
    }

    login(username, password) {
        axios.get(`${url}/user/${username}/password/${password}`)
            .then(res => {
                this.auth.setLogged(true);
                console.error(res.data);
                this.currentUser = new User(res.data.user.id, res.data.user.token, username);
                console.error(this.currentUser)
                window.localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.return()
            })
            .catch(err => {
                this.displayAlert("Error: Failed to connect!", "danger");
                console.error(err.message)
            })
    }

    register(username: string, password: string) {
        axios.post(`${url}/user`, {username: username, password: password})
            .then(res => {
                this.auth.setLogged(true);
                console.log(res.data);
                this.currentUser = new User(res.data.user.id, res.data.user.token, res.data.user.id);
                window.localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
                this.return()
                this.return()
            })
            .catch(err => {
                console.error(err.message)
            })
    }

    getCurrentUser() {
        if (this.currentUser == null) {
            let user = JSON.parse(window.localStorage.getItem('currentUser'))
            console.log(user);
            this.currentUser = new User(user.id, user.token, user.username);
        }
        return this.currentUser;
    }

    return() {
        this.router.navigate([this.returnUrl]).catch(err => console.error(err.message))
    }
}
