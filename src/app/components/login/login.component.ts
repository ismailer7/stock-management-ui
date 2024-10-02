import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

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
  toastr = inject(ToastrService);
  
  ngOnInit():void{
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);  
    }
}

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (resp: { body: any; }) => {
          const loggedUser = resp.body
          console.log(loggedUser);
          localStorage.setItem('isLoggedIn', 'true'); 
          localStorage.setItem('user', JSON.stringify(loggedUser)); 
          this.toastr.success('Login Succesfull!', 'Notification!');
          this.router.navigate(['/home']);
      },
      error: (err: Error) => this.toastr.error(err.message, 'Error!')
    })
  }

}
