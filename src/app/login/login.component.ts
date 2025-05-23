import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.formLogin = this.formBuilder.group({
      username: this.formBuilder.control(''),
      password: this.formBuilder.control('')
    });
  }

  handleLogin() {
    let username = this.formLogin.value.username;
    let password = this.formLogin.value.password;
    this.authService.login(username, password).subscribe({
      next: data => {
        this.authService.loadProfile(data);
        this.router.navigateByUrl('/admin');
      },
      error: error => {
        console.log(error);
      }
    });
  }

}
