import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { SearchComponent } from './components/search/search.component';
import { ThreadComponent } from './components/thread/thread.component';
import { ConfirmChangeImageComponent } from './components/confirm-change-image/confirm-change-image.component';
import { HomeTestTwitterComponent } from './components/home-test-twitter/home-test-twitter.component';
import { ProfileTestTwitterComponent } from './components/profile-test-twitter/profile-test-twitter.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/home" },
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  {
    path: "home", component: HomeTestTwitterComponent,
  },
  {
    path: "thread/:id", component: ThreadComponent
  },
  {
    path: "profile/:username", component: ProfileTestTwitterComponent
  },
  {
    path: "confirmChangeImageProfile", component: ConfirmChangeImageComponent
  },
  // 404
  { path: "404", component: NotFoundComponent },
  { path: "**", redirectTo: "/404" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
