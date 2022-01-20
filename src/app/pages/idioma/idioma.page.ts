import { Component, OnInit } from '@angular/core';
import { IdiomaService } from 'src/app/_services/idioma.service';

@Component({
  selector: 'app-idioma',
  templateUrl: './idioma.page.html',
  styleUrls: ['./idioma.page.scss'],
})
export class IdiomaPage implements OnInit {

  
  idiomas: Array<{title: string, value: string}>;
  lg: string;
  text: any = [];
  constructor(
    private idioma: IdiomaService
  ) {
    this.idioma.initLanguage();
    this.text = this.idioma.text;
    this.idioma.language.subscribe(
      text => {
        this.text = text;
      }
    )

    this.initLanguage();

    this.lg = this.idioma.getIdiomaLocal();

  }

  ngOnInit() {    
    console.log('ionViewDidLoad LanguagePage');
  }

  initLanguage(){
    this.idiomas = [];
    this.idiomas.push({
      title: this.text['portugues'],
      value: 'pt-br'
    });

    this.idiomas.push({
      title: this.text['ingles'],
      value: 'en'
    });

    this.idiomas.push({
      title: this.text['espanhol'],
      value: 'es'
    });
  }  

  itemSelected(idioma){
    this.lg = idioma;
    this.idioma.toRefreshLanguage(idioma);
    this.initLanguage();
  }
}
