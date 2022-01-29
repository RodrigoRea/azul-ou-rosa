import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JwtHelperService } from '@auth0/angular-jwt';
import { IUser } from 'src/app/_interfaces';
import { LojaVirtualService } from 'src/app/_services/loja-virtual.service';
import { ViacepService } from 'src/app/_services/viacep.service';
import { environment } from 'src/environments/environment';
import { Router, ActivatedRoute } from '@angular/router';

declare var $:any;

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class CadastroPage implements OnInit, AfterViewChecked {

  redirect: string = '';
  isNameValid: boolean = false;
  tab: number = 1;
  loading: boolean = false;
  estado: string = '';
  cidade: string = '';

  check = '';

  msgSuccess: string = '';
  msgError: string = '';

  email: string = '';
  user: IUser = {} as IUser;
  formulario: FormGroup | undefined;

  loadingCEP: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private lojaVirtualService: LojaVirtualService,
    private viacep: ViacepService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ionViewWillEnter(){
    this.init();
  }

  ngOnInit(){

  }
  
  init(){
    
    this.redirect = this.route.snapshot.queryParams['redirect'];

    this.formulario = this.formBuilder.group({
      nome:           ['',[Validators.required]],
      // email:          ['',[Validators.required]],
      // email:          ['',[MyValidators.multiEmailValidator()]],

      fone1:          ['',[Validators.required]],
      //fone2:          [''],
      
      endereco:       ['',[Validators.required]],
      numero:         ['',[Validators.required]],
      complemento:    [''],
      bairro:         ['',[Validators.required]],
      cep:            ['',[Validators.required]],
      //online:         [''],

      estado:         ['',[Validators.required]],
      cidade:         ['',[Validators.required]],

      // cnpj:           ['', [MyValidators.validaCNPJValidator()/* , Validators.required  */]],
      //fantasia:       ['', [Validators.required]],
      //dominio:        [''],
      //descricao:      ['',[Validators.maxLength(300)]],


      //facebook:       [''],
      //instagram:      [''],
      //youtube:        [''],
      //pinterest:      [''],
      //twitter:        ['']
    });

    const helper = new JwtHelperService();
    let tk = localStorage.getItem(environment.keytoken);
    if( tk === undefined || tk === null){
      tk = '';
    }
    const token = helper.decodeToken(tk);
    if( token !== undefined && token !== null){
      if( token.email !== undefined && token.email !== null && token.email !== ''){
        this.email = token.email;
      }
    }

    this.getUser();
  }


  ngAfterViewChecked(){
    $(document).setMask();
  }

  gravar(){    

    this.msgSuccess = '';
    this.msgError = '';
    if( this.formulario !== undefined && this.formulario.valid ){
      this.loading = true;
      this.lojaVirtualService.gravar(this.formulario.value).subscribe(gravado=>{
        this.loading = false;
        if( gravado ){
          this.msgSuccess = 'Gravado com sucesso';
          if( this.redirect !== '' ){
            this.router.navigate([`${this.redirect}`]);
          }
        }else{
          this.msgError = 'Erro: Tente novamente';
        }        
      })
    }
  }

  getUser(){
    this.loading = true;
    this.lojaVirtualService.get().subscribe(user=>{
      this.user = user;
      this.formulario?.patchValue(user);
      setTimeout(() => {
        if( this.user ){
          this.estado = this.user.estado;
          this.cidade = this.user.cidade;
          this.checkInCompletName(this.user.nome);
        }
        this.loading = false;
      });
    })
  }

  
  setLogo(imagemName: string){
    this.user.logo = ''; 
    setTimeout(() => {
      this.user.logo = imagemName; 
    }, 100);    
  }

  /*
  excluindo: boolean = false;
  excluirLogo(){
    this.excluindo = true;
    this.logoService.excluir(this.user.loja_id, this.user.logo).subscribe(res=>{
      console.log(res);
      if( res['status'] === 200 ){
        this.setLogo('');
      }else{
        this.msgError = 'Erro ao excluir esta imagem';
      }
      this.excluindo = false;
    })
  }*/


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

  resetCep(){
    setTimeout(() => {
      this.formulario.get('cep')?.setValue('');
      this.formulario.get('cidade')?.setValue('');
      this.formulario.get('estado')?.setValue('');
      this.formulario.get('bairro')?.setValue('');
      this.formulario.get('endereco')?.setValue('');
    });    
  }
      
  toPage(page) {
    this.router.navigate([`${page}`]);
  }

  checkInCompletName(name){
    console.log('name', name);
    const nome = (name).trim();
    if(nome === undefined || nome === null || nome === ''){
      this.isNameValid = false;
      return false;
    }
    if( (nome).length < 5 ){
      this.isNameValid = false;
      return false;
    }
    let parts = (nome).split(" ");
    if( (parts).length <= 1 ){
      this.isNameValid = false;
      return false;
    }
    for(let i = 0; i < (parts).length; i++){
      if( (parts[i]).length < 2 ){
        this.isNameValid = false;
        return false;
      }
    }
    this.isNameValid = true;
    return true;
  }

}
