import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { I18nService } from '@app/services/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';

@Component({
	selector: 'app-confirmation-holder',
	templateUrl: './confirmation-holder.component.html'
})
export class ConfirmationHolderComponent implements OnInit {

	mode: any;

	constructor(
		private i18nService: I18nService,
		private titleService: Title,
		private translateService: TranslateService,
		private activatedActivated: ActivatedRoute
	) {
		this.mode = this.activatedActivated.snapshot.queryParams['mode'];
	}

	ngOnInit(): void {
		let title = "title.";
		if (this.mode == "resetPassword") {
			title += "confirm-password-reset"
		} else {
			title += "confirm-email-address"
		}
		this.i18nService.breadcrumb.next(title);

		this.titleService.setTitle(
			this.translateService.instant(title)
		);
	}
}
