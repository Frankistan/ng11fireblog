import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '@app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { confirmPasswordReset } from '@store/actions/auth.actions';

@Component({
	selector: 'app-confirm-password-reset',
	templateUrl: './confirm-password-reset.component.html',
	styleUrls: ['./confirm-password-reset.component.scss']
})
export class ConfirmPasswordResetComponent {

	form: FormGroup = this.auth.passwordResetForm;

	hide = true;

	constructor(
		private auth: AuthService,
		private store: Store<State>,
		private route: ActivatedRoute,
		private titleService: Title,
		private translateService: TranslateService,
	) { }

	save() {
		const password = this.form.controls['password'].value;

		const code = this.route.snapshot.queryParams['oobCode'];

		// this.auth.confirmPasswordReset(code, password);
		this.store.dispatch(confirmPasswordReset({code,password}));

		this.titleService.setTitle(
			this.translateService.instant('title.confirm-password-reset')
		);

	}

}
