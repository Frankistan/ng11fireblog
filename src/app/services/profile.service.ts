import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { CustomValidators } from 'ngx-custom-validators';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
import firebase from "firebase/app";


// para cambiar password
// FUENTE: https://github.com/angular/angularfire2/issues/1082
// https://codinglatte.com/posts/angular/handling-firebase-password-resets-in-angular/

@Injectable({
	providedIn: 'root'
})
export class ProfileService {

	private collection: AngularFirestoreCollection<FirebaseUser>;

	constructor(
		private afAuth: AngularFireAuth,
		private db: AngularFirestore,
		private fb: FormBuilder,
		private notify: NotificationService,
	) {
		this.collection = this.db.collection('users');
	}

	get form(): FormGroup {
		let password = new FormControl("", Validators.minLength(3));

		return this.fb.group(
			{
				displayName: [
					"",
					[
						Validators.required,
						Validators.minLength(3),
						Validators.maxLength(50)
					]
				],
				email: [
					{ value: "", disabled: true },
					[Validators.required, Validators.email]
				],
				photoURL: ["", [CustomValidators.url]],
				password: password,
				password_confirm: ["", CustomValidators.equalTo(password)]
			});
	}

	create(user: any): Promise<void> {
		return this.collection.doc<FirebaseUser>(user.uid).set(user, { merge: true });
	}

	read(id: string): Observable<FirebaseUser> {
		return this.collection.doc<FirebaseUser>(id).valueChanges();
	}

	async update(user: any) {

		if (user?.password) await this.changePassword(user);

		const data: FirebaseUser = {
			...user
		}

		delete data['password'];
		delete data['password_confirm'];

		return this.collection.doc(data.uid).set(data, { merge: true });

	}

	private async changePassword(user: any): Promise<void> {
		const auth = this.afAuth;
		const Fuser: FirebaseUser = await auth.currentUser;
		Fuser.updatePassword(user.password);
	}
}
