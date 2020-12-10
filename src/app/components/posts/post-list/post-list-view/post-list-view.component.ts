import { Component, Input } from '@angular/core';
import { Post } from '@app/models/post';

@Component({
	selector: 'app-post-list-view',
	templateUrl: './post-list-view.component.html',
	styleUrls: ['./post-list-view.component.scss']
})
export class PostListViewComponent {
	@Input('data') data: Post[] = [];

	constructor() { }

}
