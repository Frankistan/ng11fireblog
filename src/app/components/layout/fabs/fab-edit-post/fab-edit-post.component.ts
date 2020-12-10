import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-fab-edit-post',
	template: `
		<a mat-fab 
			[routerLink]="['/posts/', id,'edit']" 
			class="mat-fab-bottom-right"
			matTooltip="{{ 'tooltips.fab.edit' | translate }}"
			matTooltipPosition="before"
			[matTooltipClass]="'fab-tooltip'">
			<mat-icon aria-label="edit post">edit</mat-icon>
		</a>
	`,
	styles: [`
		.mat-fab-bottom-right {
			top: auto !important;
			right: 1.5rem !important;
			bottom: 1.5rem !important;
			left: auto !important;
			position: fixed !important;
		}
  `]
})
export class FabEditPostComponent {
	id: any;
	// @Input() id;

	constructor(
		private route: ActivatedRoute,
	){
		this.id = this.route.snapshot.params['id'];
	}
}
