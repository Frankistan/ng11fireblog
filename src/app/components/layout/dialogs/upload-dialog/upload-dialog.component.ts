import { Component, Inject, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogContainer } from '@angular/material/dialog';
import { MatSliderChange } from '@angular/material/slider';
import { OverlayRef } from '@angular/cdk/overlay';
import { DynamicOverlay } from '@app/services/dynamic-overlay';
/*  image cropper imports ****/
import {
	base64ToFile,
	ImageTransform,
	ImageCroppedEvent,
	Dimensions,
	ImageCropperComponent
} from 'ngx-image-cropper';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileService } from '@app/services/file.service';
import { AngularFirestore } from '@angular/fire/firestore';


/* image-cropper
https://stackblitz.com/edit/image-cropper
https://stackblitz.com/edit/resizing-cropping-image
https://alyle.io/components/image-cropper
https://codepen.io/enlcxx/pen/vmadQz
https://stackblitz.com/edit/resizing-cropping-image
ver como lo gestiona: https://stackblitz.com/edit/image-cropper-f2ltmr
get form URL http://www.programmersought.com/article/52582038406/
*/


@Component({
	selector: 'app-upload-dialog',
	templateUrl: './upload-dialog.component.html',
	styleUrls: ['./upload-dialog.component.scss']
})
export class UploadDialogComponent implements AfterViewInit {
	readonly maxSize = 5242880;  // 5 MB

	@ViewChild(MatDialogContainer, { static: false, read: ElementRef }) matDialogContainer: ElementRef;

	overlayRef: OverlayRef;
	isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);

	files: Observable<any>;
	fileName: string = "";


	/***** image cropper vars */
	@ViewChild(ImageCropperComponent, { static: false }) cropper: ImageCropperComponent;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	canvasRotation = 0;
	rotation = 0;
	scale = 1;
	showCropper = false;
	containWithinAspectRatio = false;
	transform: ImageTransform = {};
	croppedImageFile: File;
	format: string = "jpg";

	constructor(
		public dialogRef: MatDialogRef<UploadDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dynamicOverlay: DynamicOverlay,
		public afs: AngularFirestore,
		public fileService: FileService,
	) { }

	onConfirm() {

		this.fileService.upload([this.croppedImageFile]);

		this.isLoading.next(true);

		this.fileService.downloadURL.then(url => {
			this.data.url = url;
			this.dialogRef.close(this.data);
		});		

	}

	/************ image cropper fns *************/
	fileChangeEvent(e: any): void {
		this.fileName = e.target.files[0].name;
		this.imageChangedEvent = e;
		this.croppedImage = null;
	}

	// automatic cropping on mousemove -- 
	// lo desabilito porque puse un boton para recortar
	// hay que añadir (imageCropped)="imageCropped($event)"  al html
	// imageCropped(event: ImageCroppedEvent) {
	// 	this.croppedImage = event.base64;
	// 	console.log(event, base64ToFile(event.base64));
	// }

	// manual cropping on button click
	crop() {
		let e: ImageCroppedEvent = this.cropper.crop();
		this.croppedImage = e.base64;
		this.croppedImageFile = new File([base64ToFile(e.base64)], this.fileName);
	}

	imageLoaded() {
		this.showCropper = true;
		console.log('Image loaded');
	}

	cropperReady(sourceImageDimensions: Dimensions) {
		console.log('Cropper ready', sourceImageDimensions);
	}

	loadImageFailed() {
		console.log('Load failed');
	}

	rotateLeft() {
		this.canvasRotation--;
		this.flipAfterRotate();
	}

	rotateRight() {
		this.canvasRotation++;
		this.flipAfterRotate();
	}

	private flipAfterRotate() {
		const flippedH = this.transform.flipH;
		const flippedV = this.transform.flipV;
		this.transform = {
			...this.transform,
			flipH: flippedV,
			flipV: flippedH
		};
	}

	flipHorizontal() {
		this.transform = {
			...this.transform,
			flipH: !this.transform.flipH
		};
	}

	flipVertical() {
		this.transform = {
			...this.transform,
			flipV: !this.transform.flipV
		};
	}

	resetImage() {
		this.scale = 1;
		this.rotation = 0;
		this.canvasRotation = 0;
		this.transform = {};
	}

	toggleContainWithinAspectRatio() {
		this.containWithinAspectRatio = !this.containWithinAspectRatio;
	}

	updateRotation() {
		this.transform = {
			...this.transform,
			rotate: this.rotation
		};
	}

	zoom(event: MatSliderChange) {
		this.scale = event.value;
		this.transform = {
			...this.transform,
			scale: this.scale
		};
	}

	ngAfterViewInit(): void {

		this.overlayRef = this.matDialogContainer ? this.dynamicOverlay.createWithDefaultConfig(this.matDialogContainer.nativeElement) :  null;
	}
}
