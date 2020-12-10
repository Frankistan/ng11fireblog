import { Component, forwardRef, NgZone } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, NG_VALIDATORS, ControlValueAccessor } from '@angular/forms';
import { environment } from '@env/environment';
import { I18nService } from '@app/services/i18n.service';

export function validateCaptachaInput(c: FormControl) {
	let err = {
		required: {
			given: c.value,
		}
	};

	return (c.value == null || c.value == '') ? err : null;
}

// FUENTE: https://blog.thoughtram.io/angular/2016/07/27/custom-form-controls-in-angular-2.html
@Component({
	selector: 'app-custom-recaptcha-input',
	template: `
		<ngx-recaptcha2 #captchaElem
			[siteKey]="siteKey"
			(expire)="handleExpire()"
			(load)="handleLoad()"
			(success)="handleSuccess($event)"
			[size]="size"
			[hl]="i18n.language" 
			[theme]="theme" 
			[type]="type">
		</ngx-recaptcha2>
	  `,
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			useExisting: forwardRef(() => CustomRecaptchaInputComponent),
			multi: true
		},
		{
			provide: NG_VALIDATORS,
			useValue: validateCaptachaInput,
			multi: true
		}
	]
})
export class CustomRecaptchaInputComponent implements ControlValueAccessor {

	private onChange: (value: string) => void;
	private onTouched: (value: string) => void;

	writeValue(value: any) {
		if (value !== undefined) {
			this.captchaResponse = value;
		}
	}

	registerOnChange(fn: any) {
		this.onChange = fn;
	}

	registerOnTouched(fn: any) {
		this.onTouched = fn;
	}


	size: string = "normal";
	lang: string = "es";
	theme: string = "light";
	type: string = "image";
	siteKey: string = environment.recaptcha.siteKey;

	captchaIsLoaded = false;
	captchaSuccess = false;
	captchaIsExpired = false;
	captchaResponse?: string = "";

	constructor(
		public zone: NgZone,
		public i18n: I18nService,
	) { }


	handleSuccess(captchaResponse: string): void {
		this.zone.run(() => {
			this.onChange(captchaResponse);
			this.onTouched(captchaResponse);
		});
	}

	handleLoad(): void {
	}

	handleExpire(): void {

		this.zone.run(() => {
			this.onChange(null);
			this.onTouched(null);
		});

	}
}
