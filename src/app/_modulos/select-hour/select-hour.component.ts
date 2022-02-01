import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-select-hour',
  templateUrl: './select-hour.component.html',
  styleUrls: ['./select-hour.component.scss'],
})
export class SelectHourComponent implements OnInit {

  @Input() horaValue: string = '';
  @Output() horaValueChange = new EventEmitter<string>();

  horas: string[] = [];
  minutos: string[] = []; 

  error_msg: string = '';
  selectedHora: string = '';
  selectedMinu: string = '';

  constructor() { }

  ngOnInit() {

    for(let i = 0; i < 24; i++){
      const hora = (i<10) ? `0${i}` : `${i}`;
      (this.horas).push(hora);
    }

    for(let i = 0; i < 59; i++){
      const minuto = (i<10) ? `0${i}` : `${i}`;
      (this.minutos).push(minuto);
      i = i+4;
    }

    setTimeout(() => {
      this.selectedHora = this.getFHora(this.horaValue);
      this.selectedMinu = this.getFMinuto(this.horaValue);

      this.sethorario();
    })
    
    

  }

  sethorario(){
    this.error_msg = ''; 
    setTimeout(() => {     
      if( this.selectedHora === '' || this.selectedMinu === '' ){
        this.error_msg = 'Selecione um horário válido';
        return;
      }
      const horario = `${this.selectedHora}:${this.selectedMinu}`;
      this.horaValueChange.emit(horario);   
    }); 
  }

  getFHora(hh_mm: string){ // yyyy-mm-dd
    if(hh_mm && (hh_mm).length === 5){
      const fpart = (hh_mm).split(':');
      return ((fpart).length >= 2) ? fpart[0] : '';
    }
    return '';
  }

  getFMinuto(hh_mm: string){ // yyyy-mm-dd
    if(hh_mm && (hh_mm).length === 5){
      const fpart = (hh_mm).split(':');
      return ((fpart).length >= 2) ? fpart[1] : '';
    }
    return '';
  }

}
