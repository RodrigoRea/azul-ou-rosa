import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../_auth/auth.service';


@Injectable({ providedIn: 'root' })
export class PedidoService {
    

    constructor(
        private authService: AuthService
    ) { 
    }
    

    get(id?: any):Observable<any> {
        let url = `${environment.api}/pedido`;
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

    getItem(pedido_id: any, item_id?: any):Observable<any> {
        let url = `${environment.api}/pedido/${pedido_id}`;
        if(item_id){ url = `${url}/item/${item_id}`; }
        return this.authService.get(`${url}`).pipe(
            map(res=>{
                if( res['status'] === 200 ){
                    return res['resposta'];
                }
                return undefined;
            })
        );
    }

    post(pedido_id: any, item_id: any, data: any):Observable<any> {
        let url = `${environment.api}/pedido/${pedido_id}/item/${item_id}`;
        return this.authService.post(`${url}`, data).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    return res;
                }
                return undefined;
            })
        );
    }
}