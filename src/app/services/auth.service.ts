import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { CustomValidators } from 'ngx-custom-validators';
import { FirebaseErrors } from '@app/models/firebase-errors';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { GeolocationService } from './geolocation.service';
import { map, switchMap } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { Observable, of } from 'rxjs';
import { ProfileService } from './profile.service';
import { Router } from '@angular/router';
import { User } from "@app/models/user";
import firebase from "firebase/app";

// fuente: https://www.positronx.io/send-verification-email-new-user-firebase-angular/
// https://www.positronx.io/full-angular-7-firebase-authentication-system/
// https://medium.com/@c_innovative/implementing-password-reset-can-be-a-tricky-but-inevitable-task-737badfb7bab
// https://codinglatte.com/posts/angular/handling-firebase-password-resets-in-angular/
// https://www.techiediaries.com/angular-firebase/angular-9-firebase-authentication-email-google-and-password/

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private auth: AngularFireAuth = this.afAuth;
	private _authStateUser: User;
	private _pvdr = null;
	// private loginLocation: any = null;
	// private loginLastSignInTime: any = null;

	constructor(
		private fb: FormBuilder,
		private afAuth: AngularFireAuth,
		private notify: NotificationService,
		private location: GeolocationService,
		private profile: ProfileService,
		private router: Router,
		private db: AngularFirestore,
	) { }

	get user(): Observable<User> {
		return this.afAuth.authState.pipe(
			switchMap((fUser: FirebaseUser) => {
				if (!fUser) {
					return of(null);
				}

				return this.db
					.doc<User>(`users/${fUser.uid}`)
					.valueChanges()
					.pipe(
						map((user: User) => {
							if (!user) {

								return {};
							}

							let data = this.setUserData(user, fUser);

							return this._authStateUser = {
								...user,
								...data
							}
						})
					);
			})
		);
	}

	get isAuthenticated(): Observable<boolean> {
		return this.afAuth.authState.pipe(
			map((user: FirebaseUser) => {
				let i = user && user.emailVerified ? true : false;
				// console.log('AUTH.isAuthenticated',i);
				return user && user.emailVerified ? true : false;
			}));
	}

	get loginForm(): FormGroup {
		return this.fb.group({
			email: ['fffernandez84@gmail.com', [Validators.required, Validators.email]],
			password: ['123456', Validators.required],
			// recaptcha: [null, Validators.required]
		});
	}

	get registerForm(): FormGroup {
		let password = new FormControl('123456', [Validators.minLength(3), Validators.required]);

		return this.fb.group({
			displayName: ['Fran', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
			email: ['fffernandez84@gmail.com', [Validators.required, Validators.email]],
			photoURL: ['', [CustomValidators.url]],
			// recaptcha: [null, Validators.required],
			password: password,
			password_confirm: ['123456', CustomValidators.equalTo(password)]
		});
	}

	get resetPasswordForm(): FormGroup {
		return this.fb.group({
			email: ['fffernandez84@gmail.com', [Validators.required, Validators.email]]
		});
	}

	get passwordResetForm(): FormGroup {
		let password = new FormControl('456789', [Validators.minLength(3), Validators.required]);

		return this.fb.group({
			password: password,
			password_confirm: ['456789', CustomValidators.equalTo(password)]
		});
	}

	async login(credentials: { email: string; password: string; }) {

		const firebaseUser = await this.afAuth.signInWithEmailAndPassword(credentials.email, credentials.password);

		const fUser = firebaseUser.user;

		if (!fUser.emailVerified) {
			this.notify.open("toast.auth.verify-berofe-login");
			return;
		}

		const data = this.setUserData(this._authStateUser, fUser);

		// await this.profile.update(data);
	}

	async signup(user: User) {

		const firebaseUser = await this.auth.createUserWithEmailAndPassword(
			user.email,
			user.password
		);

		const fUser = firebaseUser.user;
		const data = this.setUserData(user, fUser);

		await fUser.sendEmailVerification();

		// await this.profile.create(data);

	}

	async logout() {

		const data = {
			...this._authStateUser,
			lastSignInTime: this.timestamp || this._authStateUser.lastSignInTime
		};

		// await this.profile.update(data);

		await this.auth.signOut();
	}

	async resetPassword(email: string) {
		// return await this.auth.sendPasswordResetEmail(email);
		await this.auth.sendPasswordResetEmail(email);
	}

	async confirmPasswordReset(code: string, password: string) {
		// return await this.afAuth.confirmPasswordReset(code, password);
		await this.afAuth.confirmPasswordReset(code, password);
	}

	async confirmEmail(code: string) {
		await this.afAuth.applyActionCode(code);
	}

	socialLogin(providerName: string = "") {
		if (!providerName || providerName == "") return;
		this.provider = providerName;
		this.oAuthLogin();
	}

	private async oAuthLogin() {
		try {
			const credential: any = await this.auth.signInWithPopup(this._pvdr);
			let profile = credential.additionalUserInfo.profile || null;
			let user = credential.user;

			const data: User = {
				uid: user.uid,
				email: profile.email || user.email || "",
				displayName: profile.name || user.displayName,
				photoURL:
					user.photoURL ||
					profile.avatar_url ||
					profile.picture.data.url,
				// location: this.location.position,
				lastSignInTime: user.metadata.lastSignInTime,
				profileURL: profile.link || profile.html_url || profile.id
			};

			this.profile.create(data);
			this.router.navigate(["/posts"]);
		} catch (error) {
			return this.errorHandler(error.code);
		}
	}

	private set provider(providerName: string) {
		switch (providerName) {
			case "google":
				this._pvdr = new firebase.auth.GoogleAuthProvider();
				break;
			case "facebook":
				this._pvdr = new firebase.auth.FacebookAuthProvider();
				break;
			case "github":
				this._pvdr = new firebase.auth.GithubAuthProvider();
				break;
		}
	}

	private setUserData(user: User, fUser: FirebaseUser): User {

		return {
			uid: fUser.uid,
			displayName: user?.displayName,
			email: fUser.email,
			lastSignInTime: fUser.metadata.lastSignInTime,
			// lastSignInLocation: user.lastSignInLocation ||this._loc.position || null,
			photoURL: user?.photoURL,
			profileURL: "",
			providerId: fUser.providerData[0].providerId,
			emailVerified: fUser.emailVerified
		}
	}

	private get timestamp() {
		return firebase.firestore.FieldValue.serverTimestamp();
		// return firebase.database.ServerValue.TIMESTAMP;
	}

	private errorHandler(error: any) {
		console.log("auth SVC error: ", error);

		this.notify.open("toast.firebase." + error, "toast.close", 2000);
	}
}
