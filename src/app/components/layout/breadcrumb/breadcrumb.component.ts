import { Component } from '@angular/core';
import { I18nService } from '@app/services/i18n.service';

@Component({
	selector: 'app-breadcrumb',
	template: `<span>{{ i18n.breadcrumb | async | translate }}</span>`
})
export class BreadcrumbComponent {

	constructor(public i18n: I18nService) {}
}
