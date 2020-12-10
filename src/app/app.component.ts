import { Component, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { CoreService } from './services/core.service';
import { environment } from '@env/environment';
import { I18nService } from './services/i18n.service';
import { Logger } from './services/logger.service';
import { map, takeUntil, filter, switchMap, mergeMap, tap, flatMap } from 'rxjs/operators';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { NavigationEnd, Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, merge } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { getUser } from './store/actions/auth.actions';
import { getAuthUser, getIsAuth } from './store/reducers/auth.reducer';

const log = new Logger('App');

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
	private destroy = new Subject<any>();

	@ViewChild('drawer', { static: false }) drawer: MatSidenav;
	@ViewChild(MatSidenavContent) sidenavContent: MatSidenavContent;
	@ViewChild("filterNavRef", { static: false }) filterNavRef: MatSidenav;

	opened$: Observable<boolean>;
	mobile$: Observable<boolean>;
	isAuth$: Observable<boolean>;

	constructor(
		private breakpointObserver: BreakpointObserver,
		private core: CoreService,
		private i18nService: I18nService,
		private translateService: TranslateService,
		private titleService: Title,
		private router: Router,
		private route: ActivatedRoute,
		private auth: AuthService,
		private settings: SettingsService,
		private store: Store<State>,
	) {
		// this.opened$ = this.mobile$.pipe(mergeMap(m => {
		// 	return this.auth.isAuthenticated.pipe(map(i => !m && i))
		// }));
		this.mobile$ = this.breakpointObserver.observe(Breakpoints.XSmall)
			.pipe(map(result => result.matches));

		this.isAuth$ = this.store.select(getIsAuth);

	}

	ngOnInit(): void {

		this.store.dispatch(getUser());

		this.opened$ = this.isAuth$
			.pipe(flatMap(i => {
				return this.mobile$.pipe(map(m => {
					// console.log('isauthenticated: ', i);
					// console.log('OPENED: ', !m && i);
					return !m && i;
				}))
			}));
		/*
		this.auth.isAuthenticated
			.pipe(
				mergeMap(i => {
					return this.mobile$.pipe(map(m => !m && i))
				}),
				takeUntil(this.destroy))
			.subscribe((r) => {
				console.log('mergeMap isauthenticated: ', r);
				// console.log('OPENED: ', r);
			});

		combineLatest([this.auth.isAuthenticated, this.mobile$])
			.pipe(takeUntil(this.destroy))
			.subscribe(([i, m]) => {
				console.log('combinelatest isauthenticated: ', i);
				// console.log('OPENED: ', !m && i);
			});

		this.auth.isAuthenticated
			.pipe(
				switchMap(i => this.mobile$.pipe(map(m => !m && i))),
				takeUntil(this.destroy))
			.subscribe( r => {
				console.log('switchMap isauthenticated: ', r);
				// console.log('OPENED: ', r);
			});
		*/

		// Setup logger
		if (environment.production) {
			Logger.enableProductionMode();
		}

		log.debug('init');

		// Setup translations
		this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

		// Setup translations on user settings
		this.store.select(getAuthUser)
			.pipe(takeUntil(this.destroy))
			.subscribe((user) => {
				let settings: any = this.settings.load(!user ? {} : user.settings);
				this.i18nService.language = settings.language;
			});

		const onNavigationEnd = this.router.events
			.pipe(filter(event => event instanceof NavigationEnd));

		// Change page title on navigation or language change, based on route data
		merge(this.translateService.onLangChange, onNavigationEnd)
			.pipe(
				map(() => {
					let route = this.route;
					while (route.firstChild) {
						route = route.firstChild;
					}
					return route;
				}),
				filter(route => route.outlet === 'primary'),
				switchMap(route => route.data),
				takeUntil(this.destroy)
			)
			.subscribe(event => {
				let title = "title." + event.title;

				this.i18nService.breadcrumb.next(title);

				this.titleService.setTitle(
					this.translateService.instant(title)
				);

			});
	}

	close() {
		this.mobile$
			.pipe(takeUntil(this.destroy))
			.subscribe(result => {
				if (result) this.drawer.close();
			});
	}

	ngAfterViewInit(): void {
		// lo usa el component "btn-drawer"
		this.core.setDrawer.next(this.drawer);

		// lo usa el component "post-list" & "fab-scroll-to-top" & "search"
		this.core.setSidenavContent.next(this.sidenavContent);

		// lo usa el component "btn-filter" & "btn-more"
		this.core.setFilterNavRef.next(this.filterNavRef);


		// Load GOOGLE MAPS  script after view init
		// const DSLScript = document.createElement('script');
		// DSLScript.src = `https://maps.googleapis.com/maps/api/js?key=${environment.googmapsApiKey}`; // replace by your API key
		// DSLScript.type = 'text/javascript';
		// document.body.appendChild(DSLScript);
		// document.body.removeChild(DSLScript);
	}

	ngOnDestroy() {
		this.i18nService.destroy();
		this.destroy.next();
	}
}
