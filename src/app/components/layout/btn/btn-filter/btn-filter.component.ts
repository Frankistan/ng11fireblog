import { Component, OnDestroy } from "@angular/core";
import { MatSidenav } from '@angular/material/sidenav';
import { CoreService } from '@app/services/core.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
	selector: "app-btn-filter",
	template: `
		<button
			mat-icon-button
			fxHide.xs
			matTooltip="{{ 'tooltips.filter' | translate }}"
			[matTooltipClass]="'tooltip'"
			(click)="filterNavRef.open()"
			>
			<mat-icon>tune</mat-icon>
		</button>
	`
})
export class BtnFilterComponent implements OnDestroy {
	filterNavRef: MatSidenav;
	private destroy = new Subject<any>();

	constructor(
		public core: CoreService,
	) {
		core.setFilterNavRef
			.pipe(takeUntil(this.destroy))
			.subscribe(f => this.filterNavRef = f);
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}

}
