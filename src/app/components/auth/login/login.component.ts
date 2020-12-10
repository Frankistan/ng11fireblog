import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { Store } from '@ngrx/store';
import { login } from '@store/actions/auth.actions';
import { State } from '@store/reducers/app.reducer';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent {
	form: FormGroup = this.auth.loginForm;
	hide = true;

	constructor(
		private auth: AuthService,
		private store: Store<State>
	) { }

	save() {
		this.store.dispatch(login(this.form.value));
	}

	socialLogin(provider: string) {
		this.auth.socialLogin(provider);
	}
}
