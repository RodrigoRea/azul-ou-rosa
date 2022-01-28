import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../_auth/auth.service';

@Injectable({ providedIn: 'root' })
export class ViacepService {
    

    constructor(
        private authService: AuthService
    ) { 
    }
    
    get(cep: string):Observable<any> {
        return this.authService.getexterno(`https://viacep.com.br/ws/${cep}/json/`).pipe(
            map(res=>{
                return res;
            })
        );
    }


}