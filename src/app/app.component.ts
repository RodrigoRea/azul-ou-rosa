import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './_auth/auth.service';
import { IdiomaService } from './_services/idioma.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {

  email: string = '';
  token: any | undefined;
  isAuth: boolean = false;
  subscription: Subscription | undefined;

  text: any = [];
  
  constructor(
    private idioma: IdiomaService,
    private router: Router,
    private menu: MenuController,
    private authService: AuthService
  ) {
    this.idioma.initLanguage();    
  }
  
  ngOnInit(){
    this.text = this.idioma.getTexts();
    this.subscription = this.idioma.refreshLanguageState.subscribe(text=>this.text = text);

    this.checkIsAuthenticate();
  }

  checkIsAuthenticate(){
    this.isAuth = this.authService.getAuthState();
    this.subscription = this.authService.authState.subscribe(auth=>{
      this.isAuth = auth;  
      this.getSession(this.isAuth);    
    })
    this.getSession(this.isAuth);
  }

  async getSession(autenticado: boolean){
    if( autenticado ){
      const helper = new JwtHelperService();
      let tk = localStorage.getItem(environment.keytoken);
      if( tk === undefined || tk === null){
        tk = '';
      }
      this.token = helper.decodeToken(tk);    
      if( this.token !== undefined && this.token !== null){
        if( this.token.email !== undefined && this.token.email !== null && this.token.email !== ''){
          this.email = this.token.email;
        }
      }
    }
  }

  toPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.router.navigate([`${page}`]);
    this.menu.close();
  }

  ngOnDestroy(){
    if( this.subscription ){ this.subscription.unsubscribe(); }
  }
  
}
