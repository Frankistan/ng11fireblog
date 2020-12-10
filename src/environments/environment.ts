// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	googmapsApiKey: "AIzaSyAI3YlQ5xwK7lO34EK_on_081iaiPfpqrw",
    production: false,
    uploadPath: "uploads",
    defaultLanguage: "es-ES",
    supportedLanguages: ["en-US", "es-ES"],
    supportedLanguagesEquivalence: [
        { "en-US": "English" },
        { "es-ES": "Español" }
    ],
    recaptcha: {
        siteKey: "6LdA2JIUAAAAALs_uQf9Aids8cVHx7S_RXVYN39X",
        clientKey: "6LdA2JIUAAAAAGXHuMwYJwx-A0-OyoqmGFqI7dM_"
    },
    firebase: {
		apiKey: "AIzaSyBBYa4hfdV5sRtZcs4jg-_mNSZvGl2FHDg",
        authDomain: "uniyunity.firebaseapp.com",
        databaseURL: "https://uniyunity.firebaseio.com",
        projectId: "uniyunity",
        storageBucket: "uniyunity.appspot.com",
        messagingSenderId: "410220232138"
    }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
