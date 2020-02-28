import {Component, OnInit} from "@angular/core";
import {FormBuilder} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {RoutesConfig} from "../../configs/routes.config";
import {AuthenticationService} from "../../shared/services/authentication.service";

@Component({
    selector: 'app-register-page',
    templateUrl: './register.component.html'
})

export class RegisterPageComponent implements OnInit {
    registerForm;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService
    ) {
        this.registerForm = this.formBuilder.group({
            username: 'username',
            password: 'password'
        })
    }

    ngOnInit() {
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || RoutesConfig.routes.home
    }

    onRegister(data) {
        this.registerForm.reset();
        this.authService.register(data.username, data.password)
    }

    return() {
        this.router.navigate([this.returnUrl]).catch(err => console.error(err.message))
    }
}
