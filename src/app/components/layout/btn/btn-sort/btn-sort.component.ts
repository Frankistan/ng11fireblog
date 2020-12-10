import { Component } from '@angular/core';
import { PaginatorService, PageInit } from '@app/services/paginator.service';

@Component({
	selector: 'app-btn-sort',
	templateUrl: './btn-sort.component.html',
	styleUrls: ['./btn-sort.component.scss']
})
export class BtnSortComponent {
	reverse: boolean = true;
	field: string = "created_at";

	constructor(
		private page: PaginatorService
	) { }

	orderBy(field: string) {

		// false = created_at asc = más antiguo
		// true es created_at desc = más nuevo
		
		this.field = field;
		this.reverse = !this.reverse;
		this.page.reset();

		const init: PageInit = {
			collection: 'posts', orderBy: this.field,
			opts: {
				reverse: this.reverse
			}
		};

		this.page.init(init);

		// this.page.init('posts', this.field, {
		// 	reverse: this.reverse
		// });
	}

}
