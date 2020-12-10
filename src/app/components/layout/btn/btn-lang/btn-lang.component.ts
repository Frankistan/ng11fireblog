import { Component } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';

@Component({
	selector: 'app-btn-lang',
	templateUrl: './btn-lang.component.html',
	styleUrls: ['./btn-lang.component.scss']
})
export class BntLangComponent {

	constructor(
		private i18nService: I18nService,
	) { }

	setLanguage(language: string) {
		this.i18nService.language = language;
	}

	get languages(): string[] {
		return this.i18nService.supportedLanguages;
	}
}
