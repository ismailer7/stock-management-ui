import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  toastr = inject(ToastrService);
  submitted = false;
  
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder, private translate: TranslateService) {
    translate.setDefaultLang('en');
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
  })
  }
  
  ngOnInit():void{
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/home']);  
    }
}

  login() {

    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
  }

    const username = this.loginForm?.get('username')?.value;
    const password = this.loginForm?.get('password')?.value;
    console.log(this.loginForm?.get('username')?.value);
    console.log(this.loginForm?.get('password')?.value);

    this.authService.login(username, password).subscribe({
      next: (resp: { body: any; }) => {
          const loggedUser = resp.body
          console.log(loggedUser);
          localStorage.setItem('isLoggedIn', 'true'); 
          localStorage.setItem('user', JSON.stringify(loggedUser)); 
          this.toastr.success('Login Succesfull!', 'Notification!');
          this.router.navigate(['/home']);
      },
      error: (err: Error) => this.toastr.error('Login or password incorrect', 'Error!')
    })
  }

}
