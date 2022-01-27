import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../_auth/auth.service';


@Injectable({ providedIn: 'root' })
export class ProdutoService {
    

    constructor(
        private authService: AuthService
    ) { 
    }
    

    get(modelo_id: any, produto_id?: any):Observable<any> {
        let url = `${environment.api}/modelo/${modelo_id}/produto`;
        if(produto_id){ url = `${url}/${produto_id}`; }
        return this.authService.get(`${url}`).pipe(
            map(res=>{
                if( res['status'] === 200 ){
                    return res['resposta'];
                }
                return undefined;
            })
        );
    }
}