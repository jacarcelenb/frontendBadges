// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBhtOBvnZo3UePfr1Tn209-3VeVWm4BWqE',
    authDomain: 'replication-package.firebaseapp.com',
    projectId: 'replication-package',
    storageBucket: 'replication-package.appspot.com',
    messagingSenderId: '315407873406',
    appId: '1:315407873406:web:ed76666be5420104382f2f',
    measurementId: 'G-DG486JHJQJ',
  },
  supabase:{
    publicKey:'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zc3V2enFvcHVhdWl0bHR5cGxlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODAyOTM3NTksImV4cCI6MTk5NTg2OTc1OX0.iez6VNP2aa2nRcAho8g2CcpipkzrF1JKbAdbIWV8w8s',
    url:'https://nssuvzqopuauitltyple.supabase.co',
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
