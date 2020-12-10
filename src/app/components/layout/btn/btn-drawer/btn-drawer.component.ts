import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
import { CoreService } from '@app/services/core.service';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-btn-drawer',
	template: `
		<button type="button"
			aria-label="Toggle sidenav" 
			mat-icon-button 
			(click)="drawer.toggle()" 
			fxHide
			fxShow.xs>
			<mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
		</button>
  `
})
export class BtnDrawerComponent implements OnInit {
	private destroy = new Subject<any>();

	drawer: MatSidenav;	

	constructor(
		private core: CoreService
	) { }

	ngOnInit(): void {
		this.core.setDrawer
			.pipe(takeUntil(this.destroy))
			.subscribe(drawer => this.drawer = drawer);				
	}

	ngOnDestroy() {
		this.destroy.next();
	}
}
