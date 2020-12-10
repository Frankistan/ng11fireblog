import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { resetPassword } from '@store/actions/auth.actions';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.scss']
})
export class PasswordResetComponent {

	form: FormGroup = this.auth.resetPasswordForm;

	constructor(
		private auth: AuthService,
		private store:Store<State>,
	) { }

	save() {
		const email = this.form.controls['email'].value;
		this.store.dispatch(resetPassword({email}));
	}
}
