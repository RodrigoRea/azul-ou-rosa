import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../_auth/auth.service';


@Injectable({ providedIn: 'root' })
export class TemplateService {
    

    constructor(
        private authService: AuthService
    ) { 
    }
    

    get(id?: any):Observable<any> {
        let url = `${environment.api}/invite/template`;
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
}