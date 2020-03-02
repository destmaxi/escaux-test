import {NgModule} from '@angular/core'
import {BrowserModule} from '@angular/platform-browser'
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomePageComponent} from './pages/home/home-page.component';
import {LoginPageComponent} from "./pages/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AuthGuard} from "./shared/guards/auth.guard";
import {RegisterPageComponent} from "./pages/register/register.component";
import {HeaderComponent} from "./shared/components/header/header.component";
import {AuthenticationService} from "./shared/services/authentication.service";
import {FeedbackPageComponent} from "./pages/feedback/feedback.component";
import {FeedbackComponent} from "./shared/components/feedback/feedback.component";
import {FeedbackService} from "./shared/services/feedback.service";
import {CommentComponent} from "./shared/components/comment/comment.component";
import {VoteComponent} from "./shared/components/vote/vote.component";
import {FlashMessagesModule} from 'angular2-flash-messages'

@NgModule({
    imports: [
        BrowserModule,
        RouterModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        FlashMessagesModule.forRoot()
    ],
    declarations: [
        HomePageComponent,
        AppComponent,
        LoginPageComponent,
        RegisterPageComponent,
        HeaderComponent,
        FeedbackPageComponent,
        FeedbackComponent,
        CommentComponent,
        VoteComponent,
    ],
    providers: [
        AuthGuard,
        AuthenticationService,
        FeedbackService,
    ],
    bootstrap: [AppComponent]
})

export class AppModule {

}
