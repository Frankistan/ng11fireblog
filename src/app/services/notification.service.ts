import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBarRef, SimpleSnackBar, MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class NotificationService implements OnDestroy {
	private destroy = new Subject<any>();

	private snackBarRef: MatSnackBarRef<SimpleSnackBar>
	constructor(
		private snackBar: MatSnackBar,
		private translate: TranslateService,
	) { }

	open(message: string, action: string = "", duration: number = 4000) {

		this.translate.get(message)
			.pipe(takeUntil(this.destroy))
			.subscribe((m: string) => {

				if (action != "") {
					this.translate.get(action)
						.pipe(takeUntil(this.destroy))
						.subscribe((a: string) => {
							this.configure(m, a, duration);
						});
				} else {
					this.configure(m, action, duration);
				}
			});
	}

	private configure(m, a, d) {
		this.snackBarRef = this.snackBar.open(m, a, {
			duration: d,
		});
		this.snackBarRef.onAction()
			.pipe(takeUntil(this.destroy))
			.subscribe(() => {
				this.snackBarRef.dismiss();
			});
	}

	ngOnDestroy(): void {
		this.destroy.next();
	}
}