import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio',
  templateUrl: './audio.page.html',
  styleUrls: ['./audio.page.scss'],
})
export class AudioPage implements OnInit {

  status: 'play'|'pause' = 'pause';

  constructor() { }

  ngOnInit() {
  }

   

  play() {
    var x: any = document.getElementById("myAudio"); 
    x.play(); 
    this.status = 'play';
  } 

  pause() { 
    var x: any = document.getElementById("myAudio");
    x.pause(); 
    this.status = 'pause';
  } 

}
