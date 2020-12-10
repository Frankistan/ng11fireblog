import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { PostEditComponent } from './components/posts/post-edit/post-edit.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostShowComponent } from './components/posts/post-show/post-show.component';
import { AuthComponent } from './components/auth/auth.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ProfileComponent } from './components/profile/profile.component';
import { SettingsComponent } from './components/settings/settings.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { SearchComponent } from './components/search/search.component';
import { DiscardChangesGuard } from './guards/discard-changes.guard';
import { AuthGuard } from './guards/auth.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
import { LoginComponent } from './components/auth/login/login.component';
import { ConfirmationHolderComponent } from './components/auth/confirmation-holder/confirmation-holder.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';


const routes: Routes = [
	{ path: "", pathMatch: "full", redirectTo: "auth/login" },
	{
		path: "auth",
		component: AuthComponent,
		canActivate: [LoggedInGuard],
		children: [
			{ path: '', redirectTo: 'login', pathMatch: 'full' },
			{
				path: 'login',
				component: LoginComponent,
				data: { title: "login" }
			},
			{
				path: 'register',
				component: RegisterComponent,
				data: { title: "register" }
			},
			{
				path: 'reset-password',
				component: PasswordResetComponent,
				data: { title: 'reset-password' }
			},
			{
				path: 'confirmation',
				component: ConfirmationHolderComponent,
				data: { title: 'confirmation' }
			},
		]
	},
	{
		path: "posts",
		component: PostsComponent,
		canActivate: [AuthGuard],
		children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{
				path: 'list',
				component: PostListComponent,
				data: { title: "posts.list" }
			},
			{
				path: 'create', component: PostCreateComponent,
				canDeactivate: [DiscardChangesGuard],
				data: { title: "posts.create" }
			},
			{
				path: ':id',
				component: PostShowComponent,
				data: { title: "posts.show" }
			},
			{
				path: ':id/edit', component: PostEditComponent,
				canDeactivate: [DiscardChangesGuard],
				data: { title: "posts.edit" }
			},
		]
	},
	{ path: 'search', component: SearchComponent, data: { title: "search" } },
	{
		path: "profile", component: ProfileComponent,
		canDeactivate: [DiscardChangesGuard],
		canActivate: [AuthGuard],
		data: { title: "profile" }
	},
	{ path: "settings", component: SettingsComponent, data: { title: "settings" } },
	{ path: '**', component: PageNotFoundComponent, data: { title: "app" } },

];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
