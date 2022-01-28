import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  private verificarAcesso(){
    console.log('AuthGuard - verificarAcesso()');
    try {
        if( this.authService.tokenInStorage() ){           
        return true;
        }else{
        this.router.navigate(['/auth/login']);
        return false;
        }
    }catch{
        this.router.navigate(['/auth/login']);
        return false;
    }
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) : Observable <boolean> | boolean {
    return this.verificarAcesso();
  }

 

  canLoad(route: Route): Observable<boolean>|Promise<boolean>|boolean {
    return this.verificarAcesso();
  }

}