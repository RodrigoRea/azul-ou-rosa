import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AdMobPlus, BannerAd, InterstitialAd } from '@admob-plus/capacitor';

declare var $:any;

// AndroidManifest.xml - app ID - ADS
// <meta-data
//      android:name="com.google.android.gms.ads.APPLICATION_ID"
//      android:value="ca-app-pub-2124010802423434~2089979665" />

const AdMobPROD = {
    // AppID deve ser alterado em AndroidManifest.xml
    AppID: 'ca-app-pub-2124010802423434~2089979665',
    BannerID: 'ca-app-pub-2124010802423434/4260847431',
    InterstitialID:'ca-app-pub-2124010802423434/1843116394',
}

const AdMobDEV = {
  AppID: 'ca-app-pub-2124010802423434~2940370138',
  BannerID: 'ca-app-pub-3940256099942544/6300978111',
  InterstitialID:'ca-app-pub-3940256099942544/1033173712',
}

@Injectable({ providedIn: 'root' })
export class AdMobGoogleService {

    AdMobIDs = AdMobDEV; // AdMobDEV <-> AdMobPROD;

    private _banner: BannerAd;
    private _interstitial: InterstitialAd;

    constructor(
        private platform: Platform        
    ) { 

    }

    bannerShow(){
        this.platform.ready().then(async () => {
            this._banner = new BannerAd({
                adUnitId: this.AdMobIDs.BannerID,
            })
            await this._banner.show();
        });
    }

    async bannerHide(){
        if( this._banner ){ await this._banner.hide(); }        
    }

    loadingOn(){
        console.log('loadingOn...');
        const box = document.createElement('div');
        box.setAttribute('id','loading-ads-google');
        box.setAttribute('style',`
            position: absolute;
            width: 100%;
            left: 0;
            top: 0;
            height: 100%;
            background-color: #fff;
            opacity: 1;
        `);
        const img = document.createElement('img');
        img.setAttribute('id','loading-ads-image');
        img.setAttribute('src','/assets/imgs/loading-babe.gif'); 
        img.setAttribute('style',`margin-top: 50%;`);
        box.appendChild(img);

        const text = document.createElement('p');
        text.setAttribute('style',`text-align: center; color: #ccc;`);
        text.append('Por favor, aguarde!!!');
        box.appendChild(text);
        document.body.appendChild(box);
    }

    loadingOff(){
        $("#loading-ads-google").remove();
        console.log('loadingOff...');
    }

    interstitialShowWithLoading(){
        this.loadingOn();
        this.platform.ready().then(async () => {
            this._interstitial = new InterstitialAd({
                adUnitId: this.AdMobIDs.InterstitialID,
            });
            // await this._interstitial.load();
            await this._interstitial.load().then((r: any)=>{
                //console.log('admob ok', r);
            }, onrejected => { 
                //console.log('admob is error');
                setTimeout(() => { this.loadingOff(); },2000); 
            });
            
            setTimeout(() => { this.loadingOff(); },6000);
            setTimeout(() => { this._interstitial.show(); },5000);
        })
    }

    interstitialShow(){
        this.platform.ready().then(async () => {
            this._interstitial = new InterstitialAd({
                adUnitId: this.AdMobIDs.InterstitialID,
            });
            await this._interstitial.load();
            await this._interstitial.show();
        })
    }

    async canInterstitial(): Promise<boolean>{
        return new Promise(resolve =>{ 
            this.platform.ready().then(async () => {
                this._interstitial = new InterstitialAd({
                    adUnitId:this.AdMobIDs.InterstitialID,
                })
                await this._interstitial.load();
                await this._interstitial.show();
                resolve(true);
            });
            
        });
    }

}