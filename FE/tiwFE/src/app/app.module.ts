import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { HeadBarComponent } from './components/head-bar/head-bar.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ThreadComponent } from './components/thread/thread.component';

@NgModule({
  declarations: [
    AppComponent,
    RegistrationComponent,
    LoginComponent,
    HomePageComponent,
    HeadBarComponent,
    SearchComponent,
    ProfileComponent,
    ThreadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
