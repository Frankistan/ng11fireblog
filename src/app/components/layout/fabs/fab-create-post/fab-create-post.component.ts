import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-fab-create-post',
	template: `
		<a mat-fab 
			[routerLink]="'/posts/create'" 
			class="mat-fab-bottom-right"
			matTooltip="{{ 'tooltips.fab.create' | translate }}"
			matTooltipPosition="before"
			[matTooltipClass]="'fab-tooltip'">
			<mat-icon aria-label="create post">add</mat-icon>
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
export class FabCreatePostComponent { }
