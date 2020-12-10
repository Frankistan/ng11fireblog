import { Component } from '@angular/core';

@Component({
	selector: 'app-btn-login',
	template: `
		<a  routerLink="/auth/login"
			mat-button
			fxHide.xs>
			{{ "navbar.login" | translate }}
		</a>                    
		<a  routerLink="/auth/login"
			mat-icon-button
			fxHide.gt-xs
			matTooltip="{{ 'tooltips.login' | translate }}"
			[matTooltipClass]="'tooltip'">
			<mat-icon aria-label="iniciar sesion">fingerprint</mat-icon>
		</a>
	`
})
export class BtnLoginComponent {}