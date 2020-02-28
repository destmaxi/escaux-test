import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutesConfig} from "../../configs/routes.config";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
    selector: 'app-login-page',
    templateUrl: './login.component.html'
})

export class LoginPageComponent implements OnInit {
    checkoutForm;
    returnUrl: string;
    registerUrl = RoutesConfig.routes.register;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService
    ) {
        this.checkoutForm = this.formBuilder.group({
            username: 'username',
            password: 'password'
        })
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'
    }

    onLoginSubmit(data) {
        this.checkoutForm.reset();
        this.authService.login(data.username, data.password)
    }

    onCancel() {
        this.router.navigate([this.returnUrl]).catch(err => console.error(err.message));
    }
}
