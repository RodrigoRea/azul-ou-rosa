import { AfterViewInit, Directive, ElementRef, Input, AfterViewChecked } from '@angular/core';

declare var $: any;
declare var VMasker: any;

@Directive({
    selector: '[maskv]',
    host: {
        '(input)': 'setToMoneyMaskInput($event)'
    },
})
export class MaskvDirective implements AfterViewInit, AfterViewChecked{

  m: string = '';
  @Input() set maskv(m: any){   
      this.m = m;
  }

  constructor(
    private el: ElementRef,
  ) {}
  
  ngAfterViewInit(){
    if( this.m == 'BRL' ){
      const _this: ElementRef  = this.el.nativeElement;
      this.el.nativeElement.classList.add('money-BRL');
      setTimeout(() => {
        /*
        let rs = $("ion-input.money-BRL").find('input').val();
        if( rs ){
          rs = parseFloat(rs);
          console.log('rs', rs);
          rs = $("ion-input.money-BRL").find('input').val( rs.toFixed(2) );
        }
        */
        VMasker( $("ion-input.money-BRL").find('input') )   .maskMoney();
      });
    }
  }

  ngAfterViewChecked(){
    this.ngAfterViewInit();
  }

  setToMoneyMask(){
    let rs = this.el.nativeElement.value;
    rs = rs.replace(",","|");
    rs = rs.replaceAll(".","");
    rs = parseFloat(rs);
    console.log('setToMoneyMask rs', rs);
    // this.el.nativeElement.value = rs;
    VMasker( this.el.nativeElement ).maskMoney();
  }

  setCustomMask(m:string){
    VMasker( this.el.nativeElement ).maskPattern(m);
  }

  setToMoneyMaskInput(el: ElementRef){       
    switch (this.m) {
        case 'BRL': this.setToMoneyMask(); break;   
        default: this.setCustomMask(this.m); break;       
    }
  }

}
