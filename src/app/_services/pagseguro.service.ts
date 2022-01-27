import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../_auth/auth.service';


@Injectable({ providedIn: 'root' })
export class PagSeguroService {
    

    constructor(
        private authService: AuthService
    ) { 
    }
    

    get():Observable<any> {
        let url = `${environment.api}/payment/session`;
        return this.authService.get(`${url}`).pipe(
            map(res=>{
                if( res['status'] === 200 ){
                    return res['resposta'];
                }
                return undefined;
            })
        );
    }


    mini():Observable<any> {
        let url = `${environment.api}/payment/mini`;
        return this.authService.get(`${url}`).pipe(
            map(res=>{
                if( res['status'] === 200 ){
                    return res;
                }
                return undefined;
            })
        );
    }

    post(payload: any):Observable<any> { // `pagamentos/recebe`,
        let url = `${environment.api}/payment/transaction/received`;
        return this.authService.post(`${url}`, payload).pipe(
            map(res=>{
                if( res['status'] === 201 ){
                    return res;
                }
                return undefined;
            })
        );
    }
}