
import { NgModule } from '@angular/core';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers/app.reducer';
import { CustomSerializer } from '@store/utils/custom-route-serializer';
import { AuthEffects } from './effects/auth.effects';
import { ProfileEffects } from './effects/profile.effects';
import { PostEffects } from './effects/posts.effects';
import { environment } from '@env/environment';

export const effectsArr: any[] = [
	AuthEffects,
	ProfileEffects,
	PostEffects,
];

@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot(reducers, {
			runtimeChecks: {
				strictStateImmutability: true,
				strictActionImmutability: true
			},
			metaReducers
		}),

		StoreRouterConnectingModule.forRoot({
			serializer: CustomSerializer
		}),

		EffectsModule.forRoot(effectsArr),

		// Following import tell the application not to work with the store-devtools if in production
		!environment.production ? StoreDevtoolsModule.instrument({
			maxAge: 25, // Retains last 25 states
			logOnly: environment.production, // Restrict extension to log-only mode
		}) : [],
	]
})
export class AppStoreModule { }
