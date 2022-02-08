import { AfterViewChecked, Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ViacepService } from 'src/app/_services/viacep.service';

interface ILocal{
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cep: string;
  estado: string;
  cidade: string;
}

declare var $: any;
@Component({
  selector: 'app-select-endereco',
  templateUrl: './select-endereco.component.html',
  styleUrls: ['./select-endereco.component.scss'],
})
export class SelectEnderecoComponent implements OnInit, AfterViewChecked {

  @Input() local: ILocal | undefined;

  @Output() localChange = new EventEmitter<ILocal>();

  estado: string = '';
  cidade: string = '';
  loadingCEP: boolean = false;
  formulario: FormGroup | undefined;

  constructor(
    private viacep: ViacepService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.formulario = this.formBuilder.group({
      endereco:       ['',[Validators.required]],
      numero:         ['',[Validators.required]],
      complemento:    [''],
      bairro:         ['',[Validators.required]],
      cep:            [''],
      //online:         [''],

      estado:         ['',[Validators.required]],
      cidade:         ['',[Validators.required]],
    });

    setTimeout(() => {
      if( this.local ){
        this.local.cep = ( this.local.cep && (this.local.cep).replace('-','') === '00000000' ) ? '' : this.local.cep;
        this.formulario.patchValue(this.local);
      }

      this.formulario.valueChanges.subscribe(data => {
        console.log('form valueChanges');
        this.setLocal();
       });

    });
  }

  ngAfterViewChecked(){
    $(document).setMask();
  }


  getCep(el: any){
    let cep = el.target.value;
    if ((cep).length === 9) {
      cep = (cep).replace("-","");
      if ((cep).length === 8) {
        this.loadingCEP = true;
        this.viacep.get(cep).subscribe(res => {
          if(res && res.localidade){
            this.formulario.get('cidade')?.setValue(res.localidade);
            this.formulario.get('estado')?.setValue(res.uf);
            this.formulario.get('bairro')?.setValue(res.bairro);
            this.formulario.get('endereco')?.setValue(res.logradouro);
          }else{
            this.resetCep();
          }
          this.loadingCEP = false;
        })
      }
    }    
  }

  setEstado(e:any){
    if( e !== undefined && e !== null){
      this.estado = (e.uf) ? e.uf : '';
      this.cidade = '';
    }
    if( this.formulario !== undefined ){
      this.formulario.get('estado')?.setValue(this.estado);
      this.formulario.get('cidade')?.setValue(this.cidade);
      console.log('setEstado',e);
    }
  }


  setCidade(e:any){
    if( e !== undefined && e !== null){
      this.cidade = (e.id) ? e.id : '';
    }
    if( this.formulario !== undefined ){
      this.formulario.get('cidade')?.setValue(this.cidade);
      console.log('setCidade',e);
    }
  }

  resetCep(){
    setTimeout(() => {
      this.formulario.get('cep')?.setValue('');
      this.formulario.get('cidade')?.setValue('');
      this.formulario.get('estado')?.setValue('');
      this.formulario.get('bairro')?.setValue('');
      this.formulario.get('endereco')?.setValue('');
    });    
  }

  setLocal(){
    this.localChange.emit(this.formulario.value as ILocal);
  }

}
