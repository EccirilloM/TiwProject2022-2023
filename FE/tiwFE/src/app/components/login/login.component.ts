import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; // Importa Router
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}
  
  ngOnInit(): void {
    console.log("OnInit Login")
  }

  login() {
    const username = this.username.trim();

    if (!username || !this.password) {
      this.errorMessage = 'Please enter your username and password';
      return;
    }

    this.authService.login({username: this.username, password: this.password}).subscribe({
      next:(response) => {
        this.successMessage = 'Login successful';
        this.errorMessage = '';

        this.authService.setIsAuthenticated(true);
        this.router.navigate(['/home']);
        console.log("Questo utente si è autenticato: " + this.authService.checkIsAuthenticated());
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Login failed';
        this.successMessage = '';
      }
    });
  }
}