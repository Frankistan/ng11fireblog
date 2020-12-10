import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { State } from '@store/reducers/app.reducer';
import { logout } from '@store/actions/auth.actions';

@Component({
	selector: 'app-sidenav-nav-list',
	templateUrl: './sidenav-nav-list.component.html',
	styleUrls: ['./sidenav-nav-list.component.scss']
})
export class SidenavNavListComponent {
	private destroy = new Subject<any>();

	items = [
		{
			url: "/posts",
			icon: "home",
			name: "wall"
		},
		{
			url: "/apps",
			icon: "dashboard",
			name: "apps"
		},
		{
			url: "/documents",
			icon: "insert_drive_file",
			name: "documents"
		},
		{
			url: "/polls",
			icon: "assignment",
			name: "polls"
		},
		{
			url: "/appointments",
			icon: "date_range",
			name: "appointments"
		},
		{
			url: "/feeds",
			icon: "rss_feed",
			name: "feeds"
		},
		{
			url: "/settings",
			icon: "settings",
			name: "settings"
		},
		{
			url: "/faq",
			icon: "help",
			name: "help"
		}

	];

	constructor(private store: Store<State>) { }

	logout() {
		this.store.dispatch(logout());
	}
}
