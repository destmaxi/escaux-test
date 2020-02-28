import {async, ComponentFixture, TestBed, fakeAsync} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {LoginPageComponent} from './login.component';
import {FormBuilder} from "@angular/forms";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {AuthGuard} from "../../shared/guards/auth.guard";

describe('LoginPageComponent', () => {
    let component: LoginPageComponent;
    let fixture: ComponentFixture<LoginPageComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [
                LoginPageComponent
            ],
            providers: [
                FormBuilder
            ]
        }).overrideComponent(LoginPageComponent, {
            set: {
                providers: [
                    {provide: AuthenticationService},
                    {provide: AuthGuard}
                ]
            }
        }).compileComponents().then(_ => {
            fixture = TestBed.createComponent(LoginPageComponent);
            component = fixture.componentInstance;
        });
    }));

    function updateForm(username, password) {
        component.checkoutForm.controls['username'].setValue(username);
        component.checkoutForm.controls['password'].setValue(password)
    }

    it('Should have default default values', fakeAsync(_ => {
        expect(component.checkoutForm.value).toEqual({username: "username", password: "password"})
    }));

    it('form value should update from form changes', fakeAsync(_ => {
        updateForm('maxime', 'maxime');
        expect(component.checkoutForm.value).toEqual({username: 'maxime', password: 'maxime'})
    }))
});
