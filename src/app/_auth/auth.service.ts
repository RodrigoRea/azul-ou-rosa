import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from "@auth0/angular-jwt";

declare var $: any;
@Injectable()
export class AuthService {

    isLoading = false;
    loading: any;

    autenticado = new EventEmitter<boolean>();
    api: string = '';

    constructor(
        private router: Router,
        private httpClient: HttpClient,
    ) {
    }

    countOpen: number = 0;

    private authsubject = new Subject<boolean>();
    public authState = this.authsubject.asObservable();

    getAuthState(){
        return this.tokenInStorage();
    }

    async showLoader(){
        $("#loading-plane").show();
        this.countOpen = this.countOpen + 1;
    }

    async hideLoader(){
        $("#loading-plane").hide();
        this.countOpen = this.countOpen - 1;
    }

    post(url: string, dados: any): Observable<any> {    
        this.showLoader();
        return this.httpClient.post(this.api + url, dados).pipe(
        map(res => res), finalize(() => this.hideLoader()));
    }

    get(url: string): Observable<any> {
        this.showLoader();
        return this.httpClient.get(this.api + url).pipe(
        map(res => res), finalize(() => this.hideLoader()));
    }

    getexterno(url: string): Observable<any> {
        this.showLoader();
        return this.httpClient.get(url).pipe(
        map(res => res), finalize(() => this.hideLoader()));
    }

    delete(url: string): Observable<any> {
        this.showLoader();
        return this.httpClient.delete(this.api + url).pipe(
        map(res => res), finalize(() => this.hideLoader()));    
    }

    put(url: string, dados: any): Observable<any> {    
        this.showLoader();
        return this.httpClient.put(this.api + url, dados).pipe(
        map(res => res), finalize(() => this.hideLoader()));    
    }

    setLocalStorageToken( token: string ){ 
        localStorage.setItem( environment.keytoken, token); 
    }

    removeLocalStorageToken(){
        localStorage.removeItem(environment.keytoken);
    }
    
    setAutenticado(auth: boolean, token?: string | undefined){
        if( token !== undefined && token !== null && auth ){
            this.setLocalStorageToken(token);
            this.autenticado.emit(auth);
            this.authsubject.next(<boolean>auth);
            return true;
        }else{
            this.removeLocalStorageToken();
            this.autenticado.emit(false);
            this.authsubject.next(<boolean>false);
            this.router.navigate(['/home']);
            return false;
        }
    }

    tokenInStorage(): boolean {
        const token = localStorage.getItem(environment.keytoken);
        if (token == null || token == undefined || token == '' ) {
          return false;
        }else{
            const helper = new JwtHelperService();

            const isExpired = helper.isTokenExpired(token);
            if( isExpired ){
                return false;
            }

            const decodedToken = helper.decodeToken(token);
            if( decodedToken === undefined || decodedToken === null ){
                return false;
            }

            if( decodedToken['code'] === 'S' ){
                this.router.navigate(['/auth/code-validator']);
                return false;
            }
        }
        return true;
    }


    generateID():string {    
        let guid = () => {
          let s4 = () => {
              return Math.floor((1 + Math.random()) * 0x10000)
                  .toString(16)
                  .substring(1);
          }
          //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }
        return guid();
    }

    getSession(): any | undefined{
        const token = localStorage.getItem(environment.keytoken);
        if (token == null || token == undefined || token == '' ) {
          return undefined;
        }
        const helper = new JwtHelperService();
        const decodedToken = helper.decodeToken(token);
        console.log('user',decodedToken);
        return decodedToken;        
    }

    sidebarToggle(){
        // Adiciona ou remove a class 'sb-sidenav-toggled' em <body> para exibir ou esconder o menu lateral sidenav
        document.body.classList.toggle('sb-sidenav-toggled');
    }
}