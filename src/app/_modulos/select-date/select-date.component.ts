import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { format, parseISO } from 'date-fns';

var MESES = [
  {
    name: 'Janeiro',
    value: '01'
  },
  {
    name: 'Fevereiro',
    value: '02'
  },
  {
    name: 'Março',
    value: '03'
  },
  {
    name: 'Abril',
    value: '04'
  },
  {
    name: 'Maio',
    value: '05'
  },
  {
    name: 'Junho',
    value: '06'
  },
  {
    name: 'Julho',
    value: '07'
  },
  {
    name: 'Agosto',
    value: '08'
  },
  {
    name: 'Setembro',
    value: '09'
  },
  {
    name: 'Outubro',
    value: '10'
  },
  {
    name: 'Novembro',
    value: '11'
  },
  {
    name: 'Dezembro',
    value: '12'
  },
]

@Component({
  selector: 'app-select-date',
  templateUrl: './select-date.component.html',
  styleUrls: ['./select-date.component.scss'],
})
export class SelectDateComponent implements OnInit {

  meses: any[] = [] as any[];
  dias: string[] = [] as string[];
  anos: string[] = [] as string[]; 

  min_date: string | undefined;
  max_date: string | undefined;

  qtdDias: number = 0;

  selectedAno: string | undefined;
  selectedMes: string | undefined;
  selectedDia: string | undefined;

  error_msg: string = '';

  @Input() dateValue: string = '';
  @Output() dateValueChange = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {

    this.meses = MESES;

    this.dias = [] as string[];
    for(let i = 0; i < 31; i++){
      const dia = ((i+1)<10) ? `0${(i+1)}` : `${(i+1)}`;
      (this.dias).push(dia);
    }

    const start_date = new Date();
    const limit_date = this.addDays(start_date, 92);
    this.min_date = this.formatDefaulDate(start_date);
    this.max_date = this.formatDefaulDate(limit_date);

    const ano1 = this.getFAno(this.max_date);
    const ano2 = this.getFAno(this.max_date);
    this.anos = ( ano1 === ano2 ) ? [ano1] : [ano1,ano2];

    
    setTimeout(() => {
      this.selectedAno = this.getFAno(this.dateValue);
      this.selectedMes = this.getFMes(this.dateValue);
      this.selectedDia = this.getFDia(this.dateValue);

      this.setNumberDaysOfMonth();
    });
    
  }

  setNumberDaysOfMonth(){
    setTimeout(() => {
      this.qtdDias = this.diasNoMes(this.selectedMes, this.selectedAno);
      this.setValueSelected();
    });    
  }

  setValueSelected(){
    this.error_msg = '';
    const data = `${this.selectedAno}-${this.selectedMes}-${this.selectedDia}`;
    const nData: number = +((data).replace('-','').replace('-',''));
    const min_date: number = +((this.min_date).replace('-','').replace('-',''));
    const max_date: number = +((this.max_date).replace('-','').replace('-',''));

    if( nData < min_date ){
      this.error_msg = 'Selecione uma data futura';
      return;
    }

    if( nData > max_date ){
      this.error_msg = 'A data selecionada ultrapassa o período contratado de 90 dias';
      return;
    }

    this.dateValueChange.emit(data);
  }

  formatDate(value: string) {
    let dateValue = format(parseISO(value), 'yyyy-MM-DD');
    if( dateValue ){
      this.dateValue = dateValue;
    }
    return dateValue;
  }

  formatDefaulDate(data: Date){
    //var data = new Date(),
    let dia  = data.getDate().toString();
    let diaF = (dia.length == 1) ? '0'+dia : dia;
    let mes  = (data.getMonth()+1).toString(); //+1 pois no getMonth Janeiro começa com zero.
    let mesF = (mes.length == 1) ? '0'+mes : mes;
    let anoF = data.getFullYear();
    return anoF+"-"+mesF+"-"+diaF;
  }

  getFAno(yyyy_mm_dd: string){ // yyyy-mm-dd
    if(yyyy_mm_dd && (yyyy_mm_dd).length >= 10){
      yyyy_mm_dd = (yyyy_mm_dd).substring(0,10);
      const fpart = (yyyy_mm_dd).split('-');
      return ((fpart).length >= 3) ? fpart[0] : '';
    }
    return '';
  }

  getFMes(yyyy_mm_dd: string){ // yyyy-mm-dd
    if(yyyy_mm_dd && (yyyy_mm_dd).length >= 10){
      yyyy_mm_dd = (yyyy_mm_dd).substring(0,10);
      const fpart = (yyyy_mm_dd).split('-');
      return ((fpart).length >= 3) ? fpart[1] : '';
    }
    return '';
  }

  getFDia(yyyy_mm_dd: string){ // yyyy-mm-dd
    if(yyyy_mm_dd && (yyyy_mm_dd).length >= 10){
      yyyy_mm_dd = (yyyy_mm_dd).substring(0,10);
      const fpart = (yyyy_mm_dd).split('-');
      return ((fpart).length >= 3) ? fpart[2] : '';
    }
    return '';
  }

  diasNoMes(mes, ano) {
    this.dias = [] as string[];
    const qtdDias = new Date(+ano, +mes, 0).getDate();
    for(let i = 0; i < qtdDias; i++){
      const dia = ((i+1)<10) ? `0${(i+1)}` : `${(i+1)}`;
      (this.dias).push(dia);
    }
    this.qtdDias = qtdDias;
    return qtdDias;
  } 

  addDays(date, days) {
    const copy = new Date(Number(date))
    copy.setDate(date.getDate() + days);
    return copy;
  }

}
