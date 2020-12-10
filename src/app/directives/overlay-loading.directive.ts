import { Directive, ElementRef, OnInit, Input, OnDestroy } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';
import { Observable, Subject } from 'rxjs';
import { ComponentPortal } from '@angular/cdk/portal';
import { DynamicOverlay } from '@app/services/dynamic-overlay';
import { LoaderComponent } from '@app/components/layout/loader/loader.component';
import { takeUntil } from 'rxjs/operators';

@Directive({
	selector: '[overlayLoading]'
})
export class OverlayLoadingDirective implements OnInit,OnDestroy {
	private destroy = new Subject<any>();
	@Input('overlayLoading') toggler: Observable<boolean>;

	private overlayRef: OverlayRef;

	constructor(
		private host: ElementRef,
		private dynamicOverlay: DynamicOverlay
	) { }

	ngOnInit() {
		this.overlayRef = this.dynamicOverlay.createWithDefaultConfig(
			this.host.nativeElement
		);

		this.toggler
			.pipe(takeUntil(this.destroy))
			.subscribe(show => {
				if (show) {
					this.overlayRef.attach(new ComponentPortal(LoaderComponent));
				} else {
					this.overlayRef.detach();
				}
			});
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}
}