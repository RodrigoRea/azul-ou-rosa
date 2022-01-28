import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl, FormArray } from '@angular/forms';

declare var $: any;

// Validação para ao menos um campo do formulario preenchido
export const atLeastOne = (validator: ValidatorFn) => (
    group: FormGroup,
): ValidationErrors | null => {
    const hasAtLeastOne = group && group.controls && Object.keys(group.controls).some(k=> !validator(group.controls[k]));
    return hasAtLeastOne ? null : {
        atLeastOne: true,
    }
}



export const validaCPFValidator = () => {

    return (control: AbstractControl ): {[key:string]:any} => {

        let strCPF = control.value;
        if( strCPF != undefined && strCPF != '' && strCPF != null ){

            strCPF = strCPF.replace(/[^\d]+/g,'');
            strCPF = ( strCPF.length > 11 ) ? strCPF.substring(0,11) : strCPF;

            var Soma;
            var Resto;
            Soma = 0;
            if (
                strCPF == "12345678909" ||
                strCPF == "01234567890" ||
                strCPF == "00000000000" ||
                strCPF == "11111111111" ||
                strCPF == "22222222222" ||
                strCPF == "33333333333" ||
                strCPF == "44444444444" ||
                strCPF == "55555555555" ||
                strCPF == "66666666666" ||
                strCPF == "77777777777" ||
                strCPF == "88888888888" ||
                strCPF == "99999999999"
            ) {
                return { 'validaCPF': {value: control.value} };
            }
            
            let i = 1;
            for (i; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i);
            Resto = (Soma * 10) % 11;
            
            if ((Resto == 10) || (Resto == 11))  Resto = 0;
            if (Resto != parseInt(strCPF.substring(9, 10)) ){
                return { 'validaCPF': {value: control.value} };
            }
            
            Soma = 0;
            for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i);
            Resto = (Soma * 10) % 11;
            
            if ((Resto == 10) || (Resto == 11))  Resto = 0;
            if (Resto != parseInt(strCPF.substring(10, 11) ) ){
                return { 'validaCPF': {value: control.value} };
            }

        }
        return {};

    }
}


// CompareValidator - valValidosValidator
// Validação com comparação dos valores passados pela função
// Exemplo -> 
// campo de input text que deverá ser válido somente se o texto digitado for
// igual a algum valor do array passado pela função
export const CompareValidator = (cc: any) => {
    return (control: AbstractControl ): {[key:string]:any} => {  
        let otherInput = '' 
        try {
            otherInput = $(cc)./*find('input').*/val();
        } catch (error) {
            otherInput = ''; 
        }
        
      if(control.value == null){
          return {};
      }  
      if(control.value == undefined){
        return {};
      }  
      if(control.value == ''){
        return {};
      }    
      
      if( otherInput === control.value ){
        return {};
      }
      return { 'Compare': {value: control.value} };
    };
}

export const NotCompareValidator = (cc: any) => {
    return (control: AbstractControl ): {[key:string]:any} => {  
        let otherInput = '' 
        try {
            otherInput = $(cc).find('input').val();
        } catch (error) {
            otherInput = ''; 
        }
        
      if(control.value == null){
          return {};
      }  
      if(control.value == undefined){
        return {};
      }  
      if(control.value == ''){
        return {};
      }    
      
      if( otherInput !== control.value ){
        return {};
      }
      return { 'NotCompare': {value: control.value} };
    };
}

export const multiEmailValidator = () => {
    return (control: AbstractControl ): {[key:string]:any} => {
        const emails = control.value;
        if( emails == undefined ){ return {} }
        if( emails == null ){ return {} }
        
        const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        
        const email = (emails).split(";");

        let resultValid = true;
        for( let i=0; i<(email).length; i++ ){
            if( !regex.test( (email[i]).trim() ) ){
                resultValid = false;
            }
        }
        if(resultValid){
            return {};
        }
        return { 'isEmail': {value: control.value} };
    };
}

export const validaCNPJValidator = () => {

    return (control: AbstractControl ): {[key:string]:any} => {

        let cnpj = control.value;
        if( cnpj != undefined && cnpj != '' && cnpj != null ){
            cnpj = cnpj.replace(/[^\d]+/g,'');
            if(cnpj == ''){
                return {};
            }

            if (cnpj.length > 0 && cnpj.length != 14){
                return { 'validaCNPJ': {value: control.value} };
            }

            if (cnpj == "00000000000000" || 
                cnpj == "11111111111111" || 
                cnpj == "22222222222222" || 
                cnpj == "33333333333333" || 
                cnpj == "44444444444444" || 
                cnpj == "55555555555555" || 
                cnpj == "66666666666666" || 
                cnpj == "77777777777777" || 
                cnpj == "88888888888888" || 
                cnpj == "99999999999999") {
                
                    return { 'validaCNPJ': {value: control.value} };
            }

            // Valida DVs
            let tamanho = cnpj.length - 2
            let numeros = cnpj.substring(0,tamanho);
            let digitos = cnpj.substring(tamanho);
            let soma = 0;
            let pos = tamanho - 7;

            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2){ pos = 9; }
            }

            let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(0)){  
                return { 'validaCNPJ': {value: control.value} };
            }

            tamanho = tamanho + 1;
            numeros = cnpj.substring(0,tamanho);
            soma = 0;
            pos = tamanho - 7;
            for (let i = tamanho; i >= 1; i--) {
                soma += numeros.charAt(tamanho - i) * pos--;
                if (pos < 2){ pos = 9; }
            }
            resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
            if (resultado != digitos.charAt(1)){
                return { 'validaCNPJ': {value: control.value} };
            }

        }
        return {};
    }

}

