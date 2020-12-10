import { Component } from '@angular/core';

@Component({
	selector: 'app-btn-search',
	template: `
		<a mat-icon-button 
			matTooltip="{{ 'tooltips.search' | translate }}" 
			[matTooltipClass]="'tooltip'" 
			[routerLink]="'/posts/search'">
			<mat-icon>search</mat-icon>
		</a> 
 `
})
export class BtnSearchComponent { }