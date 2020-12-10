import { Component, Input } from '@angular/core';
import { Post } from '@app/models/post';
import { PaginatorService } from '@app/services/paginator.service';
import { CoreService } from '@app/services/core.service';
import { Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { MatSidenavContent } from '@angular/material/sidenav';

// TODO: ESTE COMPONENTE ES IGUAL post-list.component.ts

@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})
export class SearchComponent {
	private destroy = new Subject<any>();

	@Input('data') data: Post[] = [];
	sidenavContent: MatSidenavContent;
	scrollPosition: number = 0;

	constructor(
		public page: PaginatorService,
		private core: CoreService,
	) { 
		this.core.setSidenavContent
			.pipe(takeUntil(this.destroy))
			.subscribe(sidenavContent => {
				this.sidenavContent = sidenavContent;
				this.sidenavContent.elementScrolled()
					.pipe(map(e => e.srcElement), takeUntil(this.destroy))
					.subscribe((el: any) => {
						const cheight = el.clientHeight;
						const height = el.scrollHeight;
						let scroll = el.scrollTop;
						const offSet = 0;

						// console.log(`scroll: ${scroll}|cheight: ${cheight} | heigth: ${height}`);

						this.scrollPosition = scroll;

						if (scroll + cheight >= height - offSet) this.page.more();

					});
			});
	}

	ngOnDestroy(): void { 
		this.destroy.next();
	}

}
