import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AuthService } from '@app/services/auth.service';
import { State } from '@store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { register } from '@store/actions/auth.actions';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
	form: FormGroup = this.auth.registerForm;

	hide = true;

	constructor(
		private auth: AuthService,
		private store: Store<State>,
	) { }

	save() {
		this.store.dispatch(register({user:this.form.value}));
	}
}
