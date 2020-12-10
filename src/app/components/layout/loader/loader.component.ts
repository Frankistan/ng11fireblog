import { Component } from '@angular/core';

@Component({
	selector: 'app-loader',
	template: `
		<mat-card>
			<mat-card-header>
				<mat-card-title>
					{{ 'upload.loader' | translate}}
				</mat-card-title>
			</mat-card-header>
			<mat-card-content>
				<mat-progress-bar mode="indeterminate"></mat-progress-bar>
			</mat-card-content>
		</mat-card>
	`
})
export class LoaderComponent {

	constructor() { }
}