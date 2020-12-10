import {
	Overlay,
	OverlayKeyboardDispatcher,
	OverlayPositionBuilder,
	ScrollStrategyOptions,
    OverlayRef,
    OverlayOutsideClickDispatcher
} from '@angular/cdk/overlay';
import {
	ComponentFactoryResolver,
	Inject,
	Injector,
	NgZone,
	Renderer2,
	RendererFactory2,
	Injectable
} from '@angular/core';
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { DynamicOverlayContainer } from '@app/services/dynamic-overlay-container.service';
import { Location } from '@angular/common';

/* OVERLAY
https://medium.com/@admiquel/a-loader-for-your-components-with-angular-cdk-overlay-ebf5a4962e4d
https://blog.thoughtram.io/angular/2017/11/20/custom-overlays-with-angulars-cdk.html
https://codinglatte.com/posts/angular/reusable-modal-overlay-using-angular-cdk-overlay/
https://stackblitz.com/edit/overlay-demo
https://netbasal.com/creating-powerful-components-with-angular-cdk-2cef53d81cea
*/

@Injectable({
	providedIn: 'root'
})
export class DynamicOverlay extends Overlay {
	private readonly _dynamicOverlayContainer: DynamicOverlayContainer;
	private renderer: Renderer2;

	constructor(
		scrollStrategies: ScrollStrategyOptions,
		_overlayContainer: DynamicOverlayContainer,
		_componentFactoryResolver: ComponentFactoryResolver,
		_positionBuilder: OverlayPositionBuilder,
		_keyboardDispatcher: OverlayKeyboardDispatcher,
		_injector: Injector,
		_ngZone: NgZone,
		@Inject(DOCUMENT) _document: any,
		_directionality: Directionality,
        rendererFactory: RendererFactory2,
        _location: Location,
        _outsideClickDispatcher:OverlayOutsideClickDispatcher
	) {
		super(
			scrollStrategies,
			_overlayContainer,
			_componentFactoryResolver,
			_positionBuilder,
			_keyboardDispatcher,
			_injector,
			_ngZone,
			_document,
            _directionality,
            _location,
            _outsideClickDispatcher
		);
		this.renderer = rendererFactory.createRenderer(null, null);

		this._dynamicOverlayContainer = _overlayContainer;
	}

	private setContainerElement(containerElement: HTMLElement): void {
		this.renderer.setStyle(containerElement, 'transform', 'translateZ(0)');
		this._dynamicOverlayContainer.setContainerElement(containerElement);
	}

	public createWithDefaultConfig(containerElement: HTMLElement): OverlayRef {
		this.setContainerElement(containerElement);
		return super.create({
			positionStrategy: this.position()
				.global()
				.centerHorizontally()
				.centerVertically(),
			hasBackdrop: true
		});
	}
}
