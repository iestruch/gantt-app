import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HelpersService } from '../helpers/helpers.service';

@Injectable({
  providedIn: 'root'
})
export class PrivateGuardGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = HelpersService.getLocalStorageItem('user');
      if (user) {
        return true;
      } else {
        return this.router.parseUrl('login');
      }
    return true;
  }
  
}
