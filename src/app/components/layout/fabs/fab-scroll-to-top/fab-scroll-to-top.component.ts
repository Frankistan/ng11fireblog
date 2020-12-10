import { Component, NgZone, OnInit, OnDestroy, Input } from '@angular/core';
import { map, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { MatSidenavContent } from '@angular/material/sidenav';
import { Observable, Subject } from 'rxjs';
import { slideUp } from '@app/animations/scale.animation';
import { CoreService } from '@app/services/core.service';

@Component({
	selector: 'fab-scroll-to-top',
	template: `
		<button mat-mini-fab
			[@slideUp] 
			*ngIf="(visible$|async) && visible" 
			(click)="scrollToTop()"
			class="mat-fab-bottom-right" 
			[ngClass] ="{'mat-fab-bottom-search': searching}">
			<mat-icon aria-label="scroll to top">arrow_upward</mat-icon>
		</button>	
	`,
	styles: [`
		.mat-fab-bottom-right {
			top: auto !important;
			right: 1.5rem !important;
			bottom: 5.5rem !important;
			left: auto !important;
			position: fixed !important;
			z-index: 1;
		}

		.mat-fab-bottom-search {
			bottom: 1.5rem !important;
		}

	`],
	animations: [slideUp],
})
export class FabScrollToTopComponent implements OnInit, OnDestroy {
	private destroy = new Subject<any>();

	@Input('search') searching: boolean = false;
	sidenavContent: MatSidenavContent;
	scrollPosition: number = 0;
	visible: boolean = false;
	visible$: Observable<boolean>;

	constructor(
		private core: CoreService,
		private zone: NgZone,
	) { }

	ngOnInit(): void {
		this.core.setSidenavContent
			.pipe(takeUntil(this.destroy))
			.subscribe(sidenavContent => {
				this.sidenavContent = sidenavContent;

				this.visible$ = this.sidenavContent.elementScrolled()
					.pipe(
						map(e => e.srcElement),
						map((el: any) => {
							return this.zone.run(() => {
								let scroll = el.scrollTop;
								const offSet = 100;

								switch (true) {
									case scroll == 0: // TOP
										this.visible = false;
										break;
									case (scroll) > (this.scrollPosition): // DOWN
										this.visible = false;
										break;
									case (scroll) < (this.scrollPosition + offSet): // UP
										this.visible = true;
										break;

									default:
										this.visible = false;
										break;
								}

								this.scrollPosition = scroll;
								return this.visible;
							})
						}),
						distinctUntilChanged()
					);
			});
	}

	scrollToTop() {

		this.sidenavContent.getElementRef().nativeElement
			.scroll({
				top: 0,
				left: 0,
				behavior: "smooth"
			});

	}

	ngOnDestroy() {
		this.destroy.next();
	}
}
