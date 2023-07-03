import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { SearchComponent } from './components/search/search.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ThreadComponent } from './components/thread/thread.component';
import { ConfirmChangeImageComponent } from './components/confirm-change-image/confirm-change-image.component';

const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "/home" },
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },

  {
    path: "home", component: HomePageComponent,
    children: [
      {path: "thread", component: ThreadComponent}
    ]
  },
  {
    path: "search", component: SearchComponent
  },
  {
    path: "profile/:username", component: ProfileComponent
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
