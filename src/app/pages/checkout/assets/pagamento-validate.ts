import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl, Validators } from '@angular/forms';

let defaultFormat = /(\d{1,4})/g;
let cards = [
  {
    type: 'maestro',
    patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67],
    //patterns: /^(5018|5020|5038|6304|6759|676[1-3])/,
    format: defaultFormat,
    length: [12, 13, 14, 15, 16, 17, 18, 19],
    cvvLength: [3],
    luhn: true
  }, /*{
    type: 'forbrugsforeningen',
    patterns: [600],
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true
  }, {
    type: 'dankort',
    patterns: [5019],
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true
  }, */{
    type: 'visa',
    patterns: [4],
    //patterns: /^4/,
    format: defaultFormat,
    length: [13, 16, 19],
    cvvLength: [3],
    luhn: true
  }, {
    type: 'mastercard',
    patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
    //patterns: /^(5031|5[1-5])/,
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true
  }, {
    type: 'amex',
    patterns: [34, 37],
    //patterns: /^3[47]/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
    length: [15],
    cvvLength: [3, 4],
    luhn: true
  }, {
    type: 'dinersclub',
    //patterns: [30, 36, 38, 39],
    patterns: [36],
    //patterns: /^36/,
    format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
    length: [14],
    cvvLength: [3],
    luhn: true
  }, {
    type: 'discover',
    patterns: [6011, 64, 65, 622],
    //patterns: /^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)/,
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true
  }, /*{
    type: 'unionpay',
    patterns: [62, 88],
    format: defaultFormat,
    length: [16, 17, 18, 19],
    cvvLength: [3],
    luhn: false
  },*/ {
    type: 'jcb',
    patterns: [35],
    //patterns: /^35(2[89]|[3-8][0-9])/,
    format: defaultFormat,
    length: [16, 19],
    cvvLength: [3],
    luhn: true
  },
  /***********************************************/
  {
    type: 'elo',
    patterns: [636368,438935,504175,451416,636297,5067,4576,4011,50904,50905,50906],
    //patterns: /^(636368|438935|504175|451416|636297|5067|4576|4011|50904|50905|50906)/,
    format: defaultFormat,
    length: [16],
    cvvLength: [3],
    luhn: true
  },{
    type: 'aura',
    patterns: [500,501,502,503,507,505,506,507,508,509],
    //patterns: /^50[0-9]/,
    format: defaultFormat,
    length: [16,19],
    cvvLength: [3],
    luhn: true
  },{
    type: 'hipercard',
    patterns: [38,60],
    //patterns: /^(38|60)/,
    format: defaultFormat,
    length: [13,16,19],
    cvvLength: [3],
    luhn: true
  }


];

export class CreditCard {

  public static cards() {
    return cards;
  }

 
  public static cardFromNumber(num) {
    let card,
        p,
        pattern,
        ref;
    num = (num + '').replace(/\D/g, '');

    for (let i = 0, len = cards.length; i < len; i++) {
      card = cards[i];
      ref = card.patterns;
      for (let j = 0, len1 = ref.length; j < len1; j++) {
        pattern = ref[j];
        p = pattern + '';
        if (num.substr(0, p.length) === p) {
          return card;
        }
      }
    }
  }

  public static restrictNumeric(e): boolean {
    let input;
    if (e.metaKey || e.ctrlKey) {
      return true;
    }
    if (e.which === 32) {
      return false;
    }
    if (e.which === 0) {
      return true;
    }
    if (e.which < 33) {
      return true;
    }
    input = String.fromCharCode(e.which);
    return !!/[\d\s]/.test(input);
  }

  public static hasTextSelected(target) {
    return target.selectionStart !== null && target.selectionStart !== target.selectionEnd;
  }

  public static cardType(num) {
    if (!num) {
      return num;
    }

    let card = this.cardFromNumber(num);

    if (card !== null && typeof card !== 'undefined') {
      return card.type;
    } else {
      return null;
    }
  }

  public static formatCardNumber(num) {
    let card,
        groups,
        upperLength;

    num = num.replace(/\D/g, '');
    card = this.cardFromNumber(num);

    if (!card) {
      return num;
    }

    upperLength = card.length[card.length.length - 1];
    num = num.slice(0, upperLength);

    if (card.format.global) {
      let matches = num.match(card.format);
      if (matches != null) {
        return matches.join(' ');
      }
    } else {
      groups = card.format.exec(num);
      if (groups == null) {
        return;
      }
      groups.shift();
      return groups.filter(Boolean).join(' ');
    }
  }

  public static safeVal(value, target) {
    let cursor = null,
        last   = target.value,
        result: any = null;

    try {
      cursor = target.selectionStart;
    } catch (error) {}

    target.value = value;

    if (cursor !== null && target === document.activeElement) {
      if (cursor === last.length) {
        cursor = value.length;
      }

      if (last !== value) {
        let prevPair = last.slice(cursor - 1, +cursor + 1 || 9e9),
            currPair = value.slice(cursor - 1, +cursor + 1 || 9e9),
            digit = value[cursor];

        if (/\d/.test(digit) && prevPair === (`${digit} `) && currPair === (` ${digit}`)) {
          cursor = cursor + 1;
        }
      }

     result = cursor;
    }
    return result;
  }

  public static isCardNumber(key, target) {
    let card,
        digit,
        value,
        result;
    digit = String.fromCharCode(key);
    if (!/^\d+$/.test(digit)) {
      return false;
    }
    if (CreditCard.hasTextSelected(target)) {
      return true;
    }
    value = (target.value + digit).replace(/\D/g, '');
    card = CreditCard.cardFromNumber(value);
    if (card) {
      result = value.length <= card.length[card.length.length - 1];
    } else {
      result = value.length <= 16;
    }

    return result;
  }

  public static restrictExpiry(key, target) {
    let digit,
        value;
    digit = String.fromCharCode(key);
    if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
      return false;
    }
    value = `${target.value}${digit}`.replace(/\D/g, '');

    return value.length > 6;
  }

  public static replaceFullWidthChars(str) {
    if (str === null) {
      str = '';
    }

    let chr,
        idx,
        fullWidth = '\uff10\uff11\uff12\uff13\uff14\uff15\uff16\uff17\uff18\uff19',
        halfWidth = '0123456789',
        value = '',
        chars = str.split('');

    for (let i = 0; i < chars.length; i++) {
      chr = chars[i];
      idx = fullWidth.indexOf(chr);
      if (idx > -1) {
        chr = halfWidth[idx];
      }
      value += chr;
    }
    return value;
  }

  public static formatExpiry(expiry) {
    let parts = expiry.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/),
        mon,
        sep,
        year;

    if (!parts) {
      return '';
    }

    mon  = parts[1] || '';
    sep  = parts[2] || '';
    year = parts[3] || '';

    if (year.length > 0) {
      sep = ' / ';
    } else if (sep === ' /') {
      mon = mon.substring(0, 1);
      sep = '';
    } else if (mon.length === 2 || sep.length > 0) {
      sep = ' / ';
    } else if (mon.length === 1 && (mon !== '0' && mon !== '1')) {
      mon = `0${mon}`;
      sep = ' / ';
    }
    return `${mon}${sep}${year}`;
  }

  public static restrictCvc(key, target) {
    let digit = String.fromCharCode(key);
    if (!/^\d+$/.test(digit) || this.hasTextSelected(target)) {
      return false;
    }
    let val = `${target.value}${digit}`;
    return val.length <= 4;
  }

  public static luhnCheck(num) {
    let digit,
        digits = num.split('').reverse(),
        odd    = true,
        sum    = 0;

    for (let i = 0; i < digits.length; i++) {
      digit = digits[i];
      digit = parseInt(digit, 10);
      if ((odd = !odd)) {
        digit *= 2;
      }
      if (digit > 9) {
        digit -= 9;
      }
      sum += digit;
    }

    return sum % 10 === 0;
  }
}
// *********************************************************
// Validação para ao menos um campo do formulario preenchido
export const atLeastOne = (validator: ValidatorFn) => (
    group: FormGroup,
): ValidationErrors | null => {
    const hasAtLeastOne = group && group.controls && Object.keys(group.controls).some(k=> !validator(group.controls[k]));
    return hasAtLeastOne ? null : {
        atLeastOne: true,
    }
}


// Validação para data
export const vencimentoValidator = () => {

    return (control: AbstractControl ): {[key:string]:any} => {
        let data         = control.value;

        console.log( data );
                
        if( data != undefined && data != '' && data != null ){

            data = ( data.length == 7 ) ? data.substring(0,7) : data;            

            if( data.length != 7 && data.length > 1 ){
                return { 'vencimento': {value: control.value} };
            }

            if( data.indexOf('/') < 0 ){
                return { 'vencimento': {value: control.value} };
            }
           
            let dt  = data.split("/"); 
            let mes  = parseInt(dt[0]);
            let ano = parseInt(dt[1]);

            let now = new Date();
            let mm = (now.getMonth()+1);
            let yyyy = now.getFullYear();

            if( ano < yyyy ){
                return { 'vencimento': {value: control.value} };
            }

            if( ano === yyyy && mes < mm ){
                return { 'vencimento': {value: control.value} };
            }

            return null;
                          
        }
        
        return { 'vencimento': {value: control.value} };
    };
}



// Validação para data
export const dataValidator = (dd: number) => {
    return (control: AbstractControl ): {[key:string]:any} => {
        let data         = control.value;
        let valido       = false;
                
        if( data != undefined && data != '' && data != null ){

            data = ( data.length > 10 ) ? data.substring(0,10) : data;            

            if( data.length != 10 && data.length > 1 ){
                return { 'data': {value: control.value} };
            }
            data = data.replace('-','/');
            data = data.replace('-','/');
            data = data.replace('-','/');            
            let dt  = data.split("/"); 
            let txt = { 'year': parseInt(dt[2]), 'month': parseInt(dt[1]), 'day':parseInt(dt[0]) }
                  
            let newData = new Date(txt['year']+'-'+txt['month']+'-'+txt['day']);
            valido = (newData instanceof Date && !isNaN(newData.valueOf()));

            if( dd != 0 && valido ) {
                let dtMin = new Date();
                dtMin.setDate(dtMin.getDate()+dd); 
                valido = ( newData >= dtMin );
            }         
        }else{            
            return null;
        }
        if( isNaN(data) && typeof data !== 'undefined' && valido ){
            return null;
        }
        return { 'data': {value: control.value} };
    };
}



// Validação para campo de email
export const isEmailValidator = () => {
    return (control: AbstractControl ): {[key:string]:any} => {
      const email = control.value;
      const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if( regex.test( email ) ){
        return null;
      }
      return { 'isEmail': {value: control.value} };
    };
}

export const isPhoneValidator = () => {
    return (control: AbstractControl ): {[key:string]:any} => {
      let phone = control.value;      
      phone = phone.replace(/\D/g, '');
      if( (phone).length >= 10 ){
        return null;
      }
      return { 'isEmail': {value: control.value} };
    };
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
        return null;

    }
}



export const validaCNPJValidator = () => {

    return (control: AbstractControl ): {[key:string]:any} => {

        let cnpj = control.value;
        if( cnpj != undefined && cnpj != '' && cnpj != null ){
            cnpj = cnpj.replace(/[^\d]+/g,'');
            if(cnpj == ''){
                return null;
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
        return null;
    }

}


export class CreditCardValidator {
    static validateCCNumber(control: AbstractControl): ValidationErrors|null {
      if (Validators.required(control) !== undefined && Validators.required(control) !== null) {
        return {'ccNumber': true};
      }
  
      let num = control.value.toString().replace(/\s+|-/g, '');
      num = num.replace(/[^\d]+/g,'');
  
      if (!/^\d+$/.test(num)) {
        return {'ccNumber': true};
      }
  
      let card = CreditCard.cardFromNumber(num);
  
      if (!card) {
        return {'ccNumber': true};
      }
  
      if (card.length.includes(num.length) && (card.luhn === false || CreditCard.luhnCheck(num))) {
        return null;
      }
  
      const upperlength = card.length[card.length.length - 1];
      if (num.length > upperlength) {
        const registeredNum = num.substring(0, upperlength);
        if (CreditCard.luhnCheck(registeredNum)) {
          return null;
        }
      }
  
      return {'ccNumber': true};
    }
}