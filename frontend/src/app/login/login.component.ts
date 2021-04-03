import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LoginService } from './login.service';
import { catchError, switchMap, tap } from 'rxjs/operators'
import { Router } from '@angular/router';
import { HelpersService } from '../helpers/helpers.service';
import { empty, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  fg: FormGroup;

  email: string;
  pass: string;
  loading: boolean;
  error: boolean;

  constructor(
    private loginService: LoginService,
    private router: Router
  ) { }

  ngOnInit(): void {
    // cuando entra aqui limpia el storage
    HelpersService.clearLocalStorage();

    this.fg = new FormGroup({
      email: new FormControl(this.email),
      pass: new FormControl(this.pass)
    }, { updateOn: 'change' })

    // this.fg.valueChanges
    //   .pipe(
    //     switchMap(({ email, pass }) => this.loginService.login(email, pass)),
    //     tap(() => { this.error = false; }),
    //     catchError((error) => {
    //       this.error = true;
    //       return empty();
    //     })
    //   )
    //   .subscribe((value) => {
    //     if (!value) { return; }
    //     HelpersService.setLocalStorageItem('user', value);
    //     this.router.navigate(['main']);
    //   })


  }

  submit($event) {
    const { email, pass } = this.fg.value;
    this.loginService.login(email, pass)
      .pipe(
        tap(() => { this.error = false; }),
        catchError((error) => {
          return of({error});
        })
      )
      .subscribe((value) => {
        if (value.error) { 
          this.error = true;
          return; 
        }
        const user = value.data.login;
        HelpersService.setLocalStorageItem('user', user);
        this.router.navigate(['main']);
      })
  }

}
