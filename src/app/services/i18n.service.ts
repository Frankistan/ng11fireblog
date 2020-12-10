import { Injectable } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription, BehaviorSubject } from 'rxjs';


import esES from "@assets/i18n/es-ES.json";
import enUS from "@assets/i18n/en-US.json";
import { Logger } from './logger.service';

const log = new Logger('I18nService');
const languageKey = 'settings';

/**
 * Pass-through function to mark a string for translation extraction.
 * Running `npm translations:extract` will include the given string by using this.
 * @param s The string to extract for translation.
 * @return The same string.
 */
export function extract(s: string) {
	return s;
}

@Injectable({
	providedIn: 'root'
})
export class I18nService {
	defaultLanguage!: string;
	supportedLanguages!: string[];

	breadcrumb: BehaviorSubject<string> = new BehaviorSubject("");

	private langChangeSubscription!: Subscription;

	constructor(private translateService: TranslateService) {
		// Embed languages to avoid extra HTTP requests
		translateService.setTranslation("es-ES", esES);
		translateService.setTranslation("en-US", enUS);
	}

	/**
	 * Initializes i18n for the application.
	 * Loads language from local storage if present, or sets default language.
	 * @param defaultLanguage The default language to use.
	 * @param supportedLanguages The list of supported languages.
	 */
	init(defaultLanguage: string, supportedLanguages: string[]) {
		this.defaultLanguage = defaultLanguage;
		this.supportedLanguages = supportedLanguages;
		this.language = '';

		// Warning: this subscription will always be alive for the app's lifetime
		this.langChangeSubscription = this.translateService.onLangChange
			.subscribe((event: LangChangeEvent) => {
				// localStorage.setItem(languageKey, event.lang);
				let s = JSON.parse(localStorage.getItem('settings'));
				s.language = event.lang;
				localStorage.setItem(languageKey, JSON.stringify(s) );
			});
	}

	/**
	 * Cleans up language change subscription.
	 */
	destroy() {
		if (this.langChangeSubscription) {
			this.langChangeSubscription.unsubscribe();
		}
	}

	/**
	 * Sets the current language.
	 * Note: The current language is saved to the local storage.
	 * If no parameter is specified, the language is loaded from local storage (if present).
	 * @param language The IETF language code to set.
	 */
	set language(language: string) {
		language = language || JSON.parse(localStorage.getItem(languageKey))?.language || this.translateService.getBrowserCultureLang();
		let isSupportedLanguage = this.supportedLanguages.includes(language);

		// If no exact match is found, search without the region
		if (language && !isSupportedLanguage) {
			language = language.split('-')[0];
			language = this.supportedLanguages.find(supportedLanguage => supportedLanguage.startsWith(language)) || '';
			isSupportedLanguage = Boolean(language);
		}

		// Fallback if language is not supported
		if (!isSupportedLanguage) {
			language = this.defaultLanguage;
		}

		log.debug(`Language set to ${language}`);
		this.translateService.use(language);
	}

	/**
	 * Gets the current language.
	 * @return The current language code.
	 */
	get language(): string {
		return this.translateService.currentLang;
	}
}
