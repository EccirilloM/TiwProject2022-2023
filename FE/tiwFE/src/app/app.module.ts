import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ThreadComponent } from './components/thread/thread.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HeadbarComponent } from './components/head-bar/head-bar.component';
import { ConfirmChangeImageComponent } from './components/confirm-change-image/confirm-change-image.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ThreadService } from './services/thread.service';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomePageComponent,
    HeadbarComponent,
    SearchComponent,
    ProfileComponent,
    ThreadComponent,
    NotFoundComponent,
    ConfirmChangeImageComponent
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    AuthService,
    UserService,
    ThreadService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
