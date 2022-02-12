// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: true,
  cartStorage: 'sandbox_cart',
  keytoken: 'sandbox_mybabeis',

  api: 'https://api.mybabeis.com.br',
  dominiosComToken: [
    'api.mybabeis.com.br',
  ],

  pagseguro_use_sandbox: false,
  jsProducao: 'https://stc.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js',
  jsSandbox: 'https://stc.sandbox.pagseguro.uol.com.br/pagseguro/api/v2/checkout/pagseguro.directpayment.js',

  pgSeguroURL: 'https://stc.pagseguro.uol.com.br',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
