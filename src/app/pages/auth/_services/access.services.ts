import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/_auth/auth.service';
import { environment } from 'src/environments/environment';


@Injectable({ providedIn: 'root' })
export class AccessService {

    

    constructor(
        private authService: AuthService
    ) { 
    }
    

    login(credential: any):Observable<any> {
        return this.authService.post(`${environment.api}/auth/login`, credential).pipe(
            //map(res => res['resposta']),
            map(res=>{
                if( res['status'] ){
                    if( res['status'] === 201 ){
                        if( this.authService.setAutenticado(true, res['resposta']['access_token']) ){
                            return res;  
                        }
                    }
                    return res;
                }
                this.authService.setAutenticado(false);
                return [];
            })
        );
    }

    signIn(cadastro: any):Observable<any> {
        return this.authService.post(`${environment.api}/auth/cadastro`, cadastro).pipe(
            //map(res => res['resposta']),
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    // this.authService.setLocalStorageToken(res['resposta']['access_token']);
                    this.authService.setAutenticado(true, res['resposta']['access_token']);
                    return res;
                }
                // this.authService.setAutenticado(false);
                return res;
            })
        );
    }

    atualizarSenha(senhas: any):Observable<any> {
        return this.authService.post(`${environment.api}/auth/criar-nova-senha`, senhas).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    return res;
                }
                return res;
            })
        );
    }
    

    authCode(code: string):Observable<any> {
        return this.authService.post(`${environment.api}/auth/code`, {"code":code}).pipe(
            //map(res => res['resposta']),
            map(res=>{
                if( res['status'] ){
                    if( res['status'] === 201 ){
                        if( this.authService.setAutenticado(true, res['resposta']['access_token']) ){
                            return res;  
                        }
                    }
                    return res;
                }
                this.authService.setAutenticado(false);
                return [];
            })
        );
    }

    reenviarCode():Observable<any> {
        return this.authService.post(`${environment.api}/auth/create-code`, []).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    return res;
                }
                return {};
            })
        );
    }


    reenviarChave(email: string):Observable<any> {
        return this.authService.post(`${environment.api}/auth/esqueci-minha-senha`, {"email":email}).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    return res;
                }
                return res;
            })
        );
    }

    
    validarChave(email: string, chave: string):Observable<any> {
        return this.authService.post(`${environment.api}/auth/validar-chave`, {"email":email,"chave":chave}).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    return res;
                }
                return res;
            })
        );
    }

    alterarSenha(email: string, chave: string, senha: string):Observable<any> {        
        return this.authService.put(`${environment.api}/auth/alterar-senha`, {"email":email,"chave":chave,"senha":senha}).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    return res;
                }
                return res;
            })
        );
    }

}