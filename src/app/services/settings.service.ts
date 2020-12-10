import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormBuilder, FormGroup } from '@angular/forms';
import { User } from '@app/models/user';
import { NotificationService } from './notification.service';

@Injectable({
	providedIn: 'root'
})
export class SettingsService {

	constructor(
		private _db: AngularFirestore,
		private _fb: FormBuilder,
		private _ntf: NotificationService,
	) { }

	get form(): FormGroup {
		return this._fb.group({
			isDarkTheme: [false],
			language: ['']
		});
	}

	async save(user: User): Promise<any> {

		try {
			await this._db.doc(`users/${user.uid}`).set(user, { merge: true });
		} catch (error) {
			this.errorHandler(error);
		}

		this._ntf.open('toast.settings_saved', 'toast.close');

	}

	load(databaseSettings = {}):any {

		let defaults = {
			language: window.navigator.language,
			isDark: false
		};

		let localSettings = JSON.parse(localStorage.getItem('settings')) || {};

		let userSettings = { ...localSettings, ...databaseSettings };

		let settings = { ...defaults, ...userSettings };

		localStorage.setItem('settings', JSON.stringify(settings));
		
		return settings;
	}

	private errorHandler(error: any) {
		console.log("auth SVC error: ", error);

		this._ntf.open("toast.firebase." + error, "toast.close");
	}
}
