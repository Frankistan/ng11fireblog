import { ɵbypassSanitizationTrustResourceUrl } from "@angular/core";

export const environment = {
	production: ɵbypassSanitizationTrustResourceUrl,
	googmapsApiKey: "AIzaSyAI3YlQ5xwK7lO34EK_on_081iaiPfpqrw",
    uploadPath: "uploads",
    defaultLanguage: "es-ES",
    supportedLanguages: ["en-US", "es-ES"],
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
