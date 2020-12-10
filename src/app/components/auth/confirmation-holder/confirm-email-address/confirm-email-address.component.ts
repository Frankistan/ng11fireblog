import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { confirmEmail } from '@store/actions/auth.actions';

@Component({
	selector: 'app-confirm-email-address',
	templateUrl: './confirm-email-address.component.html',
	styleUrls: ['./confirm-email-address.component.scss']
})
export class ConfirmEmailAddressComponent implements OnInit {


	constructor(
		private auth: AuthService,
		private store: Store<State>,
		private route: ActivatedRoute, 
		private titleService: Title,
		private translateService: TranslateService,
	) { }

	ngOnInit(): void {
		const code = this.route.snapshot.queryParams['oobCode'];

		// this.auth.confirmEmail(code);
		this.store.dispatch(confirmEmail({code}));

		this.titleService.setTitle(
			this.translateService.instant('title.confirm-email-address')
		);

	}

}
