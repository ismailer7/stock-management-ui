import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) {}
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  
  ngOnInit():void{
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);  
    }
}

  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['/home']);
    } else {
      this.errorMessage = 'Invalid credentials';
      console.log(this.errorMessage)
    }
  }

}
