import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { I18nService } from '@app/services/i18n.service';
import { SettingsService } from '@app/services/settings.service';
import { User } from '@app/models/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { getAuthUser } from '@store/reducers/auth.reducer';


@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

	form: FormGroup;
	user$: Observable<User>;

	constructor(
		private settings: SettingsService,
		private i18n: I18nService,
		private store: Store<State>,
	) {
		this.form = settings.form;
	}

	ngOnInit(): void {

		this.user$ = this.store.select(getAuthUser)
			.pipe(
				tap(user =>
					this.form.patchValue(
						user?.settings || JSON.parse(localStorage.getItem('settings'))
						, { emitEvent: false })));
	}

	save(user: User) {
		const data = {
			...user,
			settings: this.form.value
		};

		this.settings.save(data);
		this.i18n.language = this.form.value.language;
	}

	get language(): string {
		return this.i18n.language;
	}

	get languages(): string[] {
		return this.i18n.supportedLanguages;
	}
}
