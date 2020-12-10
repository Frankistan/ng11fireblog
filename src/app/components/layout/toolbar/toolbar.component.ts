import {
	Component,
	OnInit,
	ViewChild,
	ViewContainerRef,
	ComponentFactoryResolver,
	ComponentFactory,
	OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { merge, of, Subject } from 'rxjs';
import { tap, filter, map, mergeMap, takeUntil } from 'rxjs/operators';
import { PostToolbarComponent } from './post-toolbar/post-toolbar.component';

//FUENTE: https://www.youtube.com/watch?v=dZD7pw6rmRA

@Component({
	selector: 'app-toolbar',
	templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit, OnDestroy {
	private destroy = new Subject<any>();

	@ViewChild("dynamicLoadComponent", { read: ViewContainerRef })
	entry: ViewContainerRef;

	componentRef: any;
	factory: ComponentFactory<any>;
	title: string;

	constructor(
		private resolver: ComponentFactoryResolver,
		private router: Router,
		private route: ActivatedRoute,
	) { }

	ngOnInit(): void {
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
			))
			.pipe(takeUntil(this.destroy))
			.subscribe( data => {
				this.title= data['title'];
				if (data['title']) {
					this.entry.clear();
					this.createComponent(data['title']);
				}
			});
	}

	createComponent(title: string) {		

		if (title == 'posts.list') {
			const factory = this.resolver.resolveComponentFactory(
				PostToolbarComponent
			);

			this.componentRef = this.entry.createComponent(factory);
			this.componentRef.instance.title = title;
		}
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

}
