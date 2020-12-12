// MODULES
import { AppRoutingModule } from './app-routing.module';
import { AutofocusFixModule } from 'ngx-autofocus-fix';
import { AvatarModule } from "ngx-avatar";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { CustomFirebaseModule } from './modules/custom-firebase.module';
import { CustomFormsModule } from 'ngx-custom-validators';
import { CustomHammerModule } from './modules/custom-hammer.module';
import { CustomMaterialModule } from './modules/custom-material.module';
import { CustomTinymceModule } from './modules/custom-tinymce.module';
import { CustomTranslateModule } from './modules/custom-translate.module';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { MomentModule } from "ngx-moment";
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { NgxCaptchaModule } from "ngx-captcha";
import { OverlayModule } from '@angular/cdk/overlay';
import { ScrollingModule } from '@angular/cdk/scrolling';
// COMPONENTS
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { BntLangComponent } from './components/layout/btn/btn-lang/btn-lang.component';
import { BreadcrumbComponent } from './components/layout/breadcrumb/breadcrumb.component';
import { BtnDrawerComponent } from './components/layout/btn/btn-drawer/btn-drawer.component';
import { BtnFilterComponent } from './components/layout/btn/btn-filter/btn-filter.component';
import { BtnLoginComponent } from './components/layout/btn/btn-login/btn-login.component';
import { BtnMoreComponent } from './components/layout/btn/btn-more/btn-more.component';
import { BtnSearchComponent } from './components/layout/btn/btn-search/btn-search.component';
import { BtnSortComponent } from './components/layout/btn/btn-sort/btn-sort.component';
import { BtnViewComponent } from './components/layout/btn/btn-view/btn-view.component';
import { ConfirmationHolderComponent } from './components/auth/confirmation-holder/confirmation-holder.component';
import { ConfirmDialogComponent } from './components/layout/dialogs/confirm-dialog/confirm-dialog.component';
import { ConfirmEmailAddressComponent } from './components/auth/confirmation-holder/confirm-email-address/confirm-email-address.component';
import { ConfirmPasswordResetComponent } from './components/auth/confirmation-holder/confirm-password-reset/confirm-password-reset.component';
import { CustomRecaptchaInputComponent } from './components/layout/form-controls/custom-recaptcha-input.component';
import { FabCreatePostComponent } from './components/layout/fabs/fab-create-post/fab-create-post.component';
import { FabEditPostComponent } from './components/layout/fabs/fab-edit-post/fab-edit-post.component';
import { FabScrollToTopComponent } from './components/layout/fabs/fab-scroll-to-top/fab-scroll-to-top.component';
import { FiltersComponent } from './components/layout/filters/filters.component';
import { LoaderComponent } from './components/layout/loader/loader.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { PasswordResetComponent } from './components/auth/password-reset/password-reset.component';
import { PostCreateComponent } from './components/posts/post-create/post-create.component';
import { PostEditComponent } from './components/posts/post-edit/post-edit.component';
import { PostEmptyComponent } from './components/posts/post-list/post-empty/post-empty.component';
import { PostGridViewComponent } from './components/posts/post-list/post-grid-view/post-grid-view.component';
import { PostListComponent } from './components/posts/post-list/post-list.component';
import { PostListViewComponent } from './components/posts/post-list/post-list-view/post-list-view.component';
import { PostsComponent } from './components/posts/posts.component';
import { PostShowComponent } from './components/posts/post-show/post-show.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ProfileFormComponent } from './components/profile/profile-form/profile-form.component';
import { ProfileInfoComponent } from './components/profile/profile-info/profile-info.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { SearchBoxComponent } from './components/layout/search-box/search-box.component';
import { SearchComponent } from './components/search/search.component';
import { SettingsComponent } from './components/settings/settings.component';
import { SidenavNavListComponent } from './components/layout/sidenav/nav-list/sidenav-nav-list.component';
import { SidenavToolbarComponent } from './components/layout/sidenav/toolbar/sidenav-toolbar.component';
import { SpinnerComponent } from './components/layout/spinner/spinner.component';
import { UploadDialogComponent } from './components/layout/dialogs/upload-dialog/upload-dialog.component';
// SERVICES
import { AppConfig, LoadConfig } from './services/app-config.service';
import { AuthService } from './services/auth.service';
import { CoreService } from './services/core.service';
import { DynamicOverlay } from './services/dynamic-overlay';
import { DynamicOverlayContainer } from './services/dynamic-overlay-container.service';
import { FileService } from './services/file.service';
import { FiltersService } from './services/filters.service';
import { GeocodingService } from './services/geocoding.service';
import { GeolocationService } from './services/geolocation.service';
import { NotificationService } from './services/notification.service';
import { PaginatorService } from './services/paginator.service';
import { PostsService } from './services/posts.service';
import { SettingsService } from './services/settings.service';
// GUARDS
import { AuthGuard } from './guards/auth.guard';
import { DiscardChangesGuard } from './guards/discard-changes.guard';
import { LoggedInGuard } from './guards/logged-in.guard';
// DIRECTIVE
import { OverlayLoadingDirective } from './directives/overlay-loading.directive';
import { PostToolbarComponent } from './components/layout/toolbar/post-toolbar/post-toolbar.component';
import { ToolbarComponent } from './components/layout/toolbar/toolbar.component';
import { ConfirmToolbarComponent } from './components/layout/toolbar/confirm-toolbar/confirm-toolbar.component';
import { AppStoreModule } from './store/app-store.module';
import { SplashScreenComponent } from './components/layout/splash-screen/splash-screen.component';

//FUENTE:
// https://asfo.medium.com/usando-app-initializer-en-angular-e822f3af3fb5
// https://stackoverflow.com/questions/49707830/angular-how-to-correctly-implement-app-initializer
// https://dzone.com/articles/how-to-use-the-app-initializer-token-to-hook-into

@NgModule({
	declarations: [
		AppComponent,
		AuthComponent,
		BntLangComponent,
		BreadcrumbComponent,
		BtnDrawerComponent,
		BtnFilterComponent,
		BtnLoginComponent,
		BtnMoreComponent,
		BtnSearchComponent,
		BtnSortComponent,
		BtnViewComponent,
		ConfirmDialogComponent,
		CustomRecaptchaInputComponent,
		FabCreatePostComponent,
		FabEditPostComponent,
		FabScrollToTopComponent,
		FiltersComponent,
		LoaderComponent,
		LoginComponent,
		OverlayLoadingDirective,
		PageNotFoundComponent,
		PostCreateComponent,
		PostEditComponent,
		PostEmptyComponent,
		PostGridViewComponent,
		PostListComponent,
		PostListViewComponent,
		PostsComponent,
		PostShowComponent,
		ProfileComponent,
		ProfileFormComponent,
		ProfileInfoComponent,
		RegisterComponent,
		SearchBoxComponent,
		SearchComponent,
		SettingsComponent,
		SidenavNavListComponent,
		SidenavToolbarComponent,
		SpinnerComponent,
		UploadDialogComponent,
		ConfirmPasswordResetComponent,
		ConfirmEmailAddressComponent,
		ConfirmationHolderComponent,
		PasswordResetComponent,
		PostToolbarComponent,
		ToolbarComponent,
		ConfirmToolbarComponent,
		SplashScreenComponent,
	],
	imports: [
		AppRoutingModule,
		AppStoreModule,
		AutofocusFixModule.forRoot(),
		AvatarModule,
		BrowserAnimationsModule,
		BrowserModule,
		CustomFirebaseModule,
		CustomFormsModule,
        CustomHammerModule,
		CustomMaterialModule,
		CustomTinymceModule,
        CustomTranslateModule,
		FlexLayoutModule,
		FormsModule,
		ImageCropperModule,
		LazyLoadImageModule,
		MomentModule,
		NgxCaptchaModule,
		OverlayModule,
		ReactiveFormsModule,
		ScrollingModule,
	],
	entryComponents: [
		ConfirmDialogComponent,
		LoaderComponent,
		PostToolbarComponent,
	],
	providers: [
		AuthGuard,
		AuthService,
		CoreService,
		DiscardChangesGuard,
		DynamicOverlay,
		DynamicOverlayContainer,
		FileService,
		FiltersService,
		GeocodingService,
		GeolocationService,
		LoggedInGuard,
		NotificationService,
		PaginatorService,
		PostsService,
        SettingsService,
        AppConfig,
        {
            provide: APP_INITIALIZER,
            useFactory: LoadConfig,
            deps: [AppConfig],
            multi:true
        }
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
