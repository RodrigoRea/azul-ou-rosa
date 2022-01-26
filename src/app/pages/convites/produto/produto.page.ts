import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.page.html',
  styleUrls: ['./produto.page.scss'],
})
export class ProdutoPage implements OnInit {

  formulario: FormGroup | undefined;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formulario = this.formBuilder.group({
      genero:   ['', Validators.required],
      nome1:    [''],
      nome2:    [''],

      cep: [''],
      endereco: [''],
      numero: [''],
      complemento: [''],
      bairro: [''],
      cidade: [''],
      estado: [''],

      dia: [''],
      mes: [''],
      ano: [''],

      info1: [''],
      info2: [''],
      info3: [''],

      url_lista_de_presentes: [''],
      url_confirmacao_presenca: [''],
      whatsapp: ['']
    })
  }

}
