import { Component, OnDestroy, OnInit } from '@angular/core';
import { CoreService } from '@app/services/core.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
	selector: 'app-btn-view',
	templateUrl: './btn-view.component.html',
	styleUrls: ['./btn-view.component.scss']
})
export class BtnViewComponent implements OnInit, OnDestroy {
	private destroy = new Subject<any>();
	mode: boolean = true;

	constructor(
		public core: CoreService,
	) { }

	ngOnInit() {

		this.core.viewMode
			.pipe(takeUntil(this.destroy))
			.subscribe(mode => this.mode = mode);
	}

	toogle() {
		this.core.viewMode$.next(!this.mode);
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}
}