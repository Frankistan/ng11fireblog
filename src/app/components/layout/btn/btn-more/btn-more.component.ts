import { Component, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreService } from '@app/services/core.service';
import { PaginatorService, PageInit } from '@app/services/paginator.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { State } from '@app/store/reducers/app.reducer';
import { Store } from '@ngrx/store';
import { loadPosts, clearPosts } from '@app/store/actions/post.actions';

@Component({
	selector: 'app-btn-more',
	templateUrl: './btn-more.component.html',
	styleUrls: ['./btn-more.component.scss']
})
export class BtnMoreComponent implements OnDestroy{
	private destroy = new Subject<any>();

	filterNavRef: MatSidenav;
	reverse: boolean = true;
	field: string = "created_at";
	mode: boolean = true;

	constructor(
		private page: PaginatorService,
		private core: CoreService,
		private store: Store<State>,
	) { 
		core.setFilterNavRef
			.pipe(takeUntil(this.destroy))
			.subscribe(f => this.filterNavRef = f);
	}


	orderBy(field: string) {
		this.field = field;
		this.reverse = !this.reverse;

		// this.store.dispatch(clearPosts());

		const init:PageInit= {
			collection: 'posts', orderBy: this.field, opts: { reverse: this.reverse }
		};

		this.store.dispatch(loadPosts({init}));
	}

	changeView(listView: boolean) {
		this.mode = this.mode != listView ? listView : this.mode;
		this.core.viewMode$.next(this.mode); // this.store.dispatch(new MenuToggleViewMode(listView));
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}
}
