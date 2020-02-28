import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from "./pages/home/home-page.component";
import {RoutesConfig} from "./configs/routes.config";
import {LoginPageComponent} from "./pages/login/login.component";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RegisterPageComponent} from "./pages/register/register.component";
import {FeedbackPageComponent} from "./pages/feedback/feedback.component";


const routes: Routes = [
    {path: RoutesConfig.routesNames.home, component: HomePageComponent, canActivate: [AuthGuard]},
    {path: RoutesConfig.routesNames.register, component: RegisterPageComponent},
    {path: RoutesConfig.routesNames.login, component: LoginPageComponent},
    {path: RoutesConfig.routesNames.feedback, component: FeedbackPageComponent, canActivate: [AuthGuard]},
    {path: '**', redirectTo: RoutesConfig.routes.error404},
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
