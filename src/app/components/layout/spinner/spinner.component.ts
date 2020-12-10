import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import {
	Router,
	NavigationStart,
	NavigationEnd,
	NavigationCancel,
	NavigationError
}
	from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
	selector: "app-spinner",
	template: `

		<div *ngIf="loading|async">
			<mat-toolbar color="primary" class="mat-elevation-z11">
			</mat-toolbar>
			<div
				class="spinner"
	            fxLayout="row"
				fxFlexFill
				fxLayoutAlign="center center"				
				[ngClass.sm]="'spinner-xsmall'" >
	            <mat-spinner [strokeWidth]="4" [diameter]="60"></mat-spinner>
	        </div>
		</div>
    `,
	styles: [
		`
            .spinner {
                background-color: rgba(255, 255, 255, 0.9) !important;
                transition: all 0.4s linear !important;
                height: calc(100% - 4.5rem);
            }
            .spinner-xsmall {
                height: calc(100% - 3.5rem);
            }
        `
	]
})
export class SpinnerComponent implements OnInit {
	loading: Observable<boolean>;

	constructor(
		private router: Router,
	) { }

	ngOnInit(): void {
		this.loading = this.router.events
			.pipe(
				map(event => {
					switch (true) {
						case event instanceof NavigationStart:

							return true;
						case event instanceof NavigationEnd ||
							event instanceof NavigationCancel ||
							event instanceof NavigationError:

							return false;

					}
				})
			);
	}


}
