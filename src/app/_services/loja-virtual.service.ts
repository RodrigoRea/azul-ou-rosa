import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../_auth/auth.service';


@Injectable({ providedIn: 'root' })
export class LojaVirtualService {
    

    constructor(
        private authService: AuthService
    ) { 
    }
    

    gravar(cadastro: any):Observable<any> {
        return this.authService.put(`${environment.api}/usuario/loja-virtual`, cadastro).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    console.log('ok - 201');
                    return true;
                }
                return false;
            })
        );
    }

    get(id?: any):Observable<any> {
        let url = `${environment.api}/usuario/loja-virtual`;
        if(id){ url = `${url}/${id}`; }
        return this.authService.get(`${url}`).pipe(
            map(res=>{
                if( res['status'] === 200 ){
                    return res['resposta'];
                }
                return undefined;
            })
        );
    }

    getCards(filter?: any, page?: any):Observable<any> {
        let url = `${environment.api}/loja/list`;
        if(page){
            url = `${url}?page=${page}`;
        }
        return this.authService.post(url, filter).pipe(
            map(res=>{
                if(res && (res['status'] === 200 || res['status'] === 201)){
                    return res['resposta'];
                }
                return [];
            })
        );
    }

    getDetail(id:any):Observable<any> {
        return this.authService.get(`${environment.api}/loja/detail/${id}`).pipe(
            map(res=>{
                if(res && res['status'] === 200){
                    return res['resposta'];
                }
                return [];
            })
        );
    }

    delete(motivo: string){
        const body = {"motivo": motivo}
        return this.authService.post(`${environment.api}/excluir/loja-virtual`, body).pipe(
            map(res=>{
                return res;
            })
        );
    }
}