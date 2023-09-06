import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { SearchComponent } from './components/search/search.component';
import { ThreadComponent } from './components/thread/thread.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { ConfirmChangeImageComponent } from './components/confirm-change-image/confirm-change-image.component';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { ThreadService } from './services/thread.service';
import { HomeTestTwitterComponent } from './components/home-test-twitter/home-test-twitter.component';
import { ProfileTestTwitterComponent } from './components/profile-test-twitter/profile-test-twitter.component';

import { SidebarTestTwitterComponent } from './components/sidebar-test-twitter/sidebar-test-twitter.component';
import { QuickComponent } from './components/quick/quick.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    SearchComponent,
    ThreadComponent,
    NotFoundComponent,
    ConfirmChangeImageComponent,
    HomeTestTwitterComponent,
    ProfileTestTwitterComponent,
    SidebarTestTwitterComponent,
    QuickComponent
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
