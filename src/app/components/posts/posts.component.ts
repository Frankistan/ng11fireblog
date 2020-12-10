import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { switchMap, tap, map, filter, mergeMap, takeUntil } from 'rxjs/operators';
import { of, merge, Subject } from 'rxjs';
import { Post } from '@app/models/post';
import { PostsService } from '@app/services/posts.service';
import { User } from '@app/models/user';

/* DYNAMIC COMPONENTS
FUENTE:
https://netbasal.com/dynamically-creating-components-with-angular-a7346f4a982d
https://indepth.dev/here-is-what-you-need-to-know-about-dynamic-components-in-angular/
https://medium.com/front-end-weekly/dynamically-add-components-to-the-dom-with-angular-71b0cb535286
https://blog.bitsrc.io/how-to-build-dynamic-components-in-angular-6-41f50abddc64
https://stackblitz.com/edit/angular-dynamic-components-example
https://www.tutorialandexample.com/dynamic-components-in-angular-8/

https://www.youtube.com/watch?v=FsDmA0O6btM
https://www.youtube.com/watch?v=XY__2PX_BZQ
https://www.youtube.com/watch?v=ojeVcVc9nUg&list=PL_qizAfcpJ-MhinmGp3nIUnPp_3rNW-Wc

-- advertising component example
https://angular.io/guide/dynamic-component-loader

*/
@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.scss']
})

// FUENTE: https://stackoverflow.com/questions/41496316/get-active-route-data-inside-router-events
export class PostsComponent implements OnDestroy {

	private destroy = new Subject<any>();

	id: string;
	post: Post;
	user: User;

	title: string;

	constructor(
		private auth: AuthService,
		private postService: PostsService,
		private router: Router,
		private route: ActivatedRoute
	) {

		merge(of(this.route.snapshot.params), this.router.events
			.pipe(
				tap(),
				filter((event) => event instanceof NavigationEnd),
				map(() => this.route),
				map((route) => {
					while (route.firstChild) route = route.firstChild;
					return route;
				}),
				filter((route) => route.outlet === 'primary'),
				mergeMap(route => route.data),
				takeUntil(this.destroy)
			))
			.subscribe(data => this.title = data.title);
	}

	// experimento para obtener POST, ID, USER
	experimento(){
		merge(of(this.route.snapshot.params), this.router.events
			.pipe(
				tap(),
				filter((event) => event instanceof NavigationEnd),
				map(() => this.route),
				map((route) => {
					while (route.firstChild) route = route.firstChild;
					return route;
				}),
				filter((route) => route.outlet === 'primary'),
				mergeMap(route => route.params),
			))
			.pipe(
				switchMap(params => {
					this.id = params['id'];
					return params['id'] ? this.postService.read(params['id']) : of(null)
				}),
				switchMap(post => {
					this.post = post;
					return this.auth.user
				}),
				takeUntil(this.destroy)
			)
			.subscribe(user => this.user = user)
	}

	ngOnDestroy() {
		this.destroy.next();
	}
}