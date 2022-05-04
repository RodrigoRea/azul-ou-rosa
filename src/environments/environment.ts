// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  cartStorage: 'sandbox_3_cart',
  templateStorage: 'sandbox_3_template',
  keytoken: 'sandbox_3_mybabeis',

  api: 'https://api.mybabeis.com.br',
  dominiosComToken: [
    'api.mybabeis.com.br',
  ],

  pagseguro_use_sandbox: false,
  jsProducao: 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js',
  jsSandbox: 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js',

  pgSeguroURL: 'https://stc.pagseguro.uol.com.br',
  isApp: true
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/* 

  https://admob-plus.github.io/docs/capacitor

  npm install @capacitor/cli@latest @capacitor/core@latest
  npm install @admob-plus/capacitor

  depois...
  em: android/app/src/main/AndroidManifest.xml

  <manifest>
    <application>
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-xxx~yyy" />

        <meta-data
            android:name="com.google.android.gms.ads.DELAY_APP_MEASUREMENT_INIT"
            android:value="true" />
    </application>
  </manifest>


  ***************************************************

  Configure o arquivo app-ads.txt
  app-ads.txt

  ID DO APLICATIVO: ca-app-pub-2124010802423434~5424089591

  toOpen
  ID toOpen: ca-app-pub-2124010802423434/9315271137

  toBanner 
  ID toBanner: ca-app-pub-2124010802423434/4310356463

  toIntersticial
  ID toIntersticial: ca-app-pub-2124010802423434/2666102300
*/