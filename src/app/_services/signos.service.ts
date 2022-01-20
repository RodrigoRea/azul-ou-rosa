import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root"
})
export class SignosService {

    signos: any = [];

    getSigno( dd , mm ){

        if( mm == 2 && dd >= 21 || mm == 3 && dd <= 20 ){ return 0; } // aries
        if( mm == 3 && dd >= 21 || mm == 4 && dd <= 20 ){ return 1; } // touro
        if( mm == 4 && dd >= 21 || mm == 5 && dd <= 20 ){ return 2; } // gemeos
        if( mm == 5 && dd >= 21 || mm == 6 && dd <= 22 ){ return 3; } // cancer
        if( mm == 6 && dd >= 23 || mm == 7 && dd <= 22 ){ return 4; } // leao
        if( mm == 7 && dd >= 23 || mm == 8 && dd <= 22 ){ return 5; } // virgem

        if( mm ==  8 && dd >= 23 || mm ==  9 && dd <= 22 ){ return 6;  } // libra
        if( mm ==  9 && dd >= 23 || mm == 10 && dd <= 21 ){ return 7;  } // escorpiao
        if( mm == 10 && dd >= 22 || mm == 11 && dd <= 21 ){ return 8;  } // sagitario
        if( mm == 11 && dd >= 22 || mm == 12 && dd <= 20 ){ return 9; } // capricornio
        if( mm == 12 && dd >= 21 || mm ==  1 && dd <= 18 ){ return 10; } // aquario
        if( mm ==  1 && dd >= 19 || mm ==  2 && dd <= 20 ){ return 11; } // peixes

    }


}